import { useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../../context/slices/auth.slice";

export const useLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", formData);
      dispatch(authActions.setAuthStatus(true));
      dispatch(authActions.setAccessToken(response.data.accessToken));
      dispatch(authActions.setRefreshToken(response.data.refreshToken));
      navigate("/dashboard");
    } catch (err) {
      if (err.status === 401) {
        dispatch(authActions.setVerificationEmail(formData.email));
        navigate("/verification");
      }
      setError(err.message);
    }

    setLoading(false);
  };

  return { formData, error, loading, handleChange, handleSubmit };
};
