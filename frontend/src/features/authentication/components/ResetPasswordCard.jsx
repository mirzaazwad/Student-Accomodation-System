import Input from "../../../components/input/Input";
import PrimaryButton from "../../../components/input/PrimaryButton";
import LoadingComponent from "../../../components/LoadingComponent";
import { useResetPassword } from "../hooks/useResetPassword";
import OtpInput from "react-otp-input";

const ResetPasswordCard = () => {
  const { formData, error,setOtp, handleChange, handleSubmit, loading } =
    useResetPassword();
  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="w-full lg:w-2/3 flex flex-col lg:m-4 m-0 lg:p-4 p-2 bg-white rounded-lg shadow-md">
      {error && (
        <div className="font-semibold w-full m-4 p-4 bg-red-200 text-red-800 border border-red-800 text-center">
          {error}
        </div>
      )}
      <div className="w-full m-4 p-4 text-center font-semibold">
        An OTP has been sent to your email address. Please enter the OTP to
        verify your email.
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="w-full flex flex-row justify-center items-center my-12 px-4 py-4">
          <OtpInput
            value={formData.otp}
            id="otp"
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              width: "1.5rem",
              height: "1.5rem",
              padding: "0.5rem",
              margin: "0 1rem",
              fontSize: "0.75rem",
              borderRadius: 4,
              border: "1px solid rgba(0,0,0,0.3)",
            }}
          />
        </div>
        <Input
          value={formData.password}
          onChange={handleChange}
          placeholder={"*************"}
          id="password"
          type="password"
          label="Password"
        />
        <Input
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder={"*************"}
          id="confirmPassword"
          type="password"
          label="Confirm Password"
        />
        <PrimaryButton type="submit" loading={loading} disabled={loading}>
          Reset Password
        </PrimaryButton>
      </form>
    </div>
  );
};

export default ResetPasswordCard;
