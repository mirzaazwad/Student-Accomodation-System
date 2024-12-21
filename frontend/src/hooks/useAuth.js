import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axios } from "../utils/RequestHandler";
import { authActions } from "../context/slices/auth.slice";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth.auth);
  const [authCheckLoading, setAuthCheckLoading] = useState(false);
  const dispatch = useDispatch();

  const checkAuthenticationStatus = async () => {
    setAuthCheckLoading(true);
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    if (access) {
      const verified = await axios.post("/auth/verify-access-token", {
        accessToken: access,
      });
      if (verified && verified.data.success) {
        dispatch(authActions.setAuthStatus(true));
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
        dispatch(authActions.setAccessToken(found.data.accessToken));
        setAuthCheckLoading(false);
        return;
      }
    }
    dispatch(authActions.setAuthStatus(false));
    dispatch(authActions.logout());
    setAuthCheckLoading(false);
  };

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  return { auth, authCheckLoading };
};
