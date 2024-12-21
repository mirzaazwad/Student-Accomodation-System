const Error = ({ error }) => {
  return (
    <div className="flex flex-row h-screen bg-background">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-12">
        <div className="lg:hidden w-full flex rounded-full flex-row justify-center items-center mb-6">
          <img
            src="background.png"
            alt="Student Accommodation"
            className="w-3/4 h-full object-cover rounded-full"
          />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">
          An Unexpected Error Occured, {error}
        </h1>
        <p className="text-lg text-text-secondary mb-6">
          Please try again later or contact support.
        </p>
        <button className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg">
          Get Started
        </button>
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

export default Error;
