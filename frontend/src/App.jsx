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

function App() {
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
          {/* <Route path="appartments" element={<AppartmentPage />} /> */}
          {/* <Route path="roommates" element={<AppartmentPage />} /> */}
          {/* <Route path="profile" element={<AppartmentPage />} /> */}
          {/* <Route path="settings" element={<AppartmentPage />} /> */}
        </Route>
        <Route path="/error404" element={<Error error={"NOT FOUND"} />} />
        <Route path="/error401" element={<Error error={"UNAUTHORIZED"} />} />
        <Route path="/error403" element={<Error error={"FORBIDDEN"} />} />
        <Route
          path="/error500"
          element={<Error error={"INTERNAL SERVER ERROR"} />}
        />
      </Routes>
    </>
  );
}

export default App;
