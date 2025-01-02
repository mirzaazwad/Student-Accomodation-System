const { User } = require("../models/user.model");
const Auth = require("../models/auth.model");
const bcrypt = require("bcrypt");
const EmailService = require("../providers/email");
const jwt = require("jsonwebtoken");

const generateAuthToken = async (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    }
  );

  const auth = await Auth.create({
    refreshToken,
    userId: user._id,
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_REFRESH_EXPIRES_IN.split("d")[0]) *
          24 *
          60 *
          60 *
          1000
    ),
  });
  return {
    accessToken,
    refreshToken,
  };
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("User Not Found");
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw Error("Invalid Password");
    }

    if (!user.verified) {
      user.otp = Math.floor(100000 + Math.random() * 900000);
      user.otpType = "register";
      await user.save();
      await EmailService.sendEmail(
        email,
        "OTP Verification",
        `Your OTP is ${user.otp}`
      );
      return res.status(401).json({
        message: "User Not Verified",
        redirect: true,
      });
    }
    const tokens = await generateAuthToken(user);
    return res.status(200).json({
      message: "Login Successful",
      ...tokens,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Login: " + error.message,
    });
  }
};

const verifyAccessToken = async (req, res, next) => {
  const accessToken = req.body.accessToken;
  if (!accessToken) {
    return res.status(401).json({
      message: "Access Token Required",
    });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id }).select(
      "-password -otp -otpType"
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "Valid Access Token",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Access Token",
      success: false,
    });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const auth = await Auth.findOne({ refreshToken });
    if (!auth) {
      throw Error("Invalid Refresh Token");
    }
    if (auth.expires < Date.now()) {
      await Auth.deleteOne({ refreshToken });
      throw Error("Refresh Token Expired");
    }
    const user = await User.findOne({ _id: auth.userId }).select(
      "-password -otp -otpType"
    );
    if (!user) {
      throw Error("User Not Found");
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    await Auth.updateOne(
      { refreshToken },
      {
        $set: {
          accessToken,
        },
      }
    );
    return res.status(200).json({
      message: "Token Refreshed Successfully",
      accessToken,
      user,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Refresh Token: " + error.message,
      success: false,
    });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    await Auth.deleteOne({ refreshToken });
    return res.status(200).json({
      message: "Logout Successful",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Logout: " + error.message,
    });
  }
};

const register = async (req, res) => {
  const { email, password, username, userType } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashed,
      username,
      otp,
      userType,
      otpType: "register",
    });
    await EmailService.sendEmail(
      email,
      "OTP Verification",
      `Your OTP is ${otp}`
    );
    return res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Register: " + error.message,
    });
  }
};

const verify = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("User Not Found");
    }
    if (user.otp !== otp) {
      throw Error("Invalid OTP");
    }
    user.verified = true;
    await user.save();
    return res.status(200).json({
      message: "User Verified Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Verify: " + error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("User Not Found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpType = "forgotPassword";
    await user.save();
    await EmailService.sendEmail(
      email,
      "OTP Verification for Forgot Password",
      `Your OTP is ${otp}`
    );
    return res.status(200).json({
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Send OTP: " + error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("User Not Found");
    }
    if (user.otp !== otp) {
      throw Error("Invalid OTP");
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return res.status(200).json({
      message: "Password Reset Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Reset Password: " + error.message,
    });
  }
};

module.exports = {
  login,
  register,
  verify,
  forgotPassword,
  verifyAccessToken,
  resetPassword,
  refresh,
  logout,
};
