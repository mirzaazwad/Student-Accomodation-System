const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body)
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // await transporter.sendMail({
    //   to: user.email,
    //   subject: 'Verify Your Account',
    //   html:<p> Click <a href="${verificationLink}">Verify</a> to verify your email and activate your account.</p>,
    // });


    res
      .status(201)
      .json({ message: "User registered. Check email for verification link." });
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: "Error Occurred" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with token and user data (excluding password)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { register, login };
