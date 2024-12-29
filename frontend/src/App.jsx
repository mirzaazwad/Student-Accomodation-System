import { Route, Routes } from "react-router-dom";
import PublicOutlet from "./components/PublicOutlet";
import LoginPage from "./features/authentication/pages/LoginPage";
import RegisterPage from "./features/authentication/pages/RegisterPage";
import PrivateOutlet from "./components/PrivateOutlet";
import HomePage from "./pages/Home";
import Error from "./components/Error";
import EmailVerification from "./features/authentication/pages/EmailVerificationPage";
import ResetPassword from "./features/authentication/pages/ResetPasswordPage";
import ForgotPassword from "./features/authentication/pages/ForgotPasswordPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import LogoutPage from "./features/authentication/pages/LogoutPage";
import AppartmentPage from "./features/appartments/pages/AppartmentPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import RoommatesPage from "./features/roommates/pages/RoommatesPage";
import AppartmentDetailsPage from "./features/appartments/pages/AppartmentDetailsPage";
import { lazy, Suspense } from "react";
import LoadingComponent from "./components/LoadingComponent";
import { useSelector } from "react-redux";
import ListingPage from "./features/listing/pages/ListingPage";
import ListingDetailsPage from "./features/listing/pages/ListingDetailsPage";
const ModalRouter = lazy(() => import("./ModalRouter"));

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Routes>
        <Route path="/*" element={<PublicOutlet />}>
          <Route path="" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verification" element={<EmailVerification />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/*" element={<PrivateOutlet />}>
          <Route path="logout" element={<LogoutPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {user.userType === "student" && (
            <>
              <Route path="appartments" element={<AppartmentPage />} />
              <Route
                path="appartments/:id"
                element={<AppartmentDetailsPage />}
              />
              <Route path="roommates" element={<RoommatesPage />} />
            </>
          )}
          {user.userType === "landlord" && (
            <>
              <Route path="listing" element={<ListingPage />} />
              <Route path="listing/:id" element={<ListingDetailsPage />} />
            </>
          )}
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/error404" element={<Error error={"NOT FOUND"} />} />
        <Route path="/error401" element={<Error error={"UNAUTHORIZED"} />} />
        <Route path="/error403" element={<Error error={"FORBIDDEN"} />} />
        <Route
          path="/error500"
          element={<Error error={"INTERNAL SERVER ERROR"} />}
        />
      </Routes>
      <Suspense fallback={<LoadingComponent />}>
        <ModalRouter />
      </Suspense>
    </>
  );
}

export default App;
