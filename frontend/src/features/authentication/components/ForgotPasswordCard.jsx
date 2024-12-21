import { MdEmail } from "react-icons/md";
import Input from "../../../components/input/Input";
import PrimaryButton from "../../../components/input/PrimaryButton";
import LoadingComponent from "../../../components/LoadingComponent";
import { useForgotPassword } from "../hooks/useForgotPassword";

const ForgotPasswordCard = () => {
  const { email, error, loading, setEmail, handleSubmit } = useForgotPassword();
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
      <div className="w-full flex flex-row justify-center items-center">
        <MdEmail className="text-6xl text-center text-primary" />
      </div>
      <div className="w-full m-4 p-4 text-center font-semibold">
        Enter your email address to receive an OTP to reset your password.
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={"someone@example.com"}
          type="email"
          label="Email"
        />
        <PrimaryButton type="submit" loading={loading} disabled={loading}>
          Send OTP
        </PrimaryButton>
      </form>
    </div>
  );
};

export default ForgotPasswordCard;
