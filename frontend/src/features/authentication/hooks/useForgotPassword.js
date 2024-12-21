import { useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import { useNavigate } from "react-router-dom";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/auth/forgot-password", {
        email,
      });
      localStorage.setItem("reset-password-email", email);
      navigate("/reset-password");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return { email, error, loading, setEmail, handleSubmit };
};
