import { useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import { useNavigate } from "react-router-dom";

export const useResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("reset-password-email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      await axios.post("/auth/reset-password", {
        email,
        otp: formData.otp,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setOtp = (otp) => {
    setFormData({ ...formData, otp });
  };

  return { formData, error, setOtp, loading, handleChange, handleSubmit };
};
