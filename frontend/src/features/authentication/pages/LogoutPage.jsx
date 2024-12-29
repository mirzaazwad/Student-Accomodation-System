import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../../../components/LoadingComponent";
import { authActions } from "../../../context/auth.slice";
import { useNavigate } from "react-router-dom";
import { axios } from "../../../utils/RequestHandler";
import { useEffect } from "react";

const LogoutPage = () => {
  const navigate = useNavigate();
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const dispatch = useDispatch();

  const logout = async () => {
    await axios.post("/auth/logout", {
      refreshToken: refreshToken ?? localStorage.getItem("refresh"),
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
