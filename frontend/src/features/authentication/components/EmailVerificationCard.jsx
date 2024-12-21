import PrimaryButton from "../../../components/input/PrimaryButton";
import LoadingComponent from "../../../components/LoadingComponent";
import { useVerification } from "../hooks/useVerification";
import OtpInput from "react-otp-input";

const EmailVerificationCard = () => {
  const { otp, error, setOtp, handleSubmit, loading } = useVerification();
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
            value={otp}
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
        <PrimaryButton type="submit" loading={loading} disabled={loading}>
          Verify Email
        </PrimaryButton>
      </form>
    </div>
  );
};

export default EmailVerificationCard;
