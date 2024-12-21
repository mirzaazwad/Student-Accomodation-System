import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingComponent from "./LoadingComponent";
import LoggedOutNavbar from "./navbar/LoggedOutNavbar";

const PublicOutlet = () => {
  const { auth, authCheckLoading } = useAuth();

  if (authCheckLoading) {
    return <LoadingComponent />;
  }

  return !auth ? (
    <div className="w-full max-w-screen h-full max-h-screen flex flex-col">
      <LoggedOutNavbar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default PublicOutlet;
