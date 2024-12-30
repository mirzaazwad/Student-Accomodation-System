import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axios } from "../utils/RequestHandler";
import { authActions } from "../context/auth.slice";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth.auth);
  const access = useSelector((state) => state.auth.access);
  const refresh = useSelector((state) => state.auth.refresh);
  const [authCheckLoading, setAuthCheckLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkAuthenticationStatus = async () => {
    setAuthCheckLoading(true);
    try {
      if (access) {
        const verified = await axios.post("/auth/verify-access-token", {
          accessToken: access,
        });
        if (verified && verified.data.success) {
          dispatch(authActions.setAuthStatus(true));
          dispatch(authActions.setUser(verified.data.user));
          setAuthCheckLoading(false);
          return;
        }
      }
      if (refresh) {
        const found = await axios.post("/auth/refresh", {
          refreshToken: refresh,
        });
        if (found && found.data.success) {
          dispatch(authActions.setAuthStatus(true));
          dispatch(authActions.setUser(found.data.user));
          dispatch(authActions.setAccessToken(found.data.accessToken));
          setAuthCheckLoading(false);
          return;
        }
      }
      dispatch(authActions.setAuthStatus(false));
      dispatch(authActions.logout());
      setAuthCheckLoading(false);
      navigate("/login");
    } catch {
      dispatch(authActions.setAuthStatus(false));
      dispatch(authActions.logout());
      setAuthCheckLoading(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  return { auth, authCheckLoading, access, refresh };
};
