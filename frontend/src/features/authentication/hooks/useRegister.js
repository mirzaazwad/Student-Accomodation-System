import { useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../../context/slices/auth.slice";

export const useRegister = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "student",
    confirmPassword: "",
    username: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      await axios.post("/auth/register", formData);
      dispatch(authActions.setVerificationEmail(formData.email));
      navigate("/verification");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return { formData, error, loading, handleChange, handleSubmit };
};
