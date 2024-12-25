import { useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const useVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.verificationEmail);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/auth/verify", {
        email,
        otp,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    }

    setLoading(false);
  };

  return { otp, error, loading, setOtp, handleSubmit };
};
