import { useDispatch } from "react-redux";
import LoadingComponent from "../../../components/LoadingComponent";
import { authActions } from "../../../context/auth.slice";
import { useNavigate } from "react-router-dom";
import { axios } from "../../../utils/RequestHandler";
import { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const dispatch = useDispatch();

  const logout = async () => {
    await axios.post("/auth/logout", {
      refreshToken: refresh,
    });
    dispatch(authActions.logout());
    navigate("/");
  };

  useEffect(() => {
    logout();
  }, []);

  return <LoadingComponent />;
};

export default LogoutPage;
