import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingComponent from "./LoadingComponent";
import LoggedInNavbar from "./navbar/LoggedInNavbar";

const PrivateOutlet = () => {
  const { auth, authCheckLoading } = useAuth();

  if (authCheckLoading) {
    return <LoadingComponent />;
  }

  return auth ? (
    <div className="w-full max-w-screen h-full max-h-screen flex flex-col">
      <LoggedInNavbar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateOutlet;
