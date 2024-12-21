import EmailVerificationCard from "../components/EmailVerificationCard";

const EmailVerification = () => {
  return (
    <div className="w-full max-w-full flex flex-row h-screen bg-background">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center">
        <EmailVerificationCard />
      </div>

      <div className="hidden lg:w-1/2 lg:flex">
        <img
          src="background.png"
          alt="Student Accommodation"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default EmailVerification;
