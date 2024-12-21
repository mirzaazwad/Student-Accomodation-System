import { Link } from "react-router-dom";
import Input from "../../../components/input/Input";
import PrimaryButton from "../../../components/input/PrimaryButton";
import LoadingComponent from "../../../components/LoadingComponent";
import { useLogin } from "../hooks/useLogin";

const LoginCard = () => {
  const { formData, error, handleChange, handleSubmit, loading } = useLogin();
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
      <form className="w-full" onSubmit={handleSubmit}>
        <Input
          value={formData.email}
          onChange={handleChange}
          placeholder={"someone@example.com"}
          id="email"
          type="text"
          label="Email"
        />
        <Input
          value={formData.password}
          onChange={handleChange}
          placeholder={"*************"}
          id="password"
          type="password"
          label="Password"
        />
        <div className="w-full font-bold mx-4 my-2 p-4">
          Forgot Password?{" "}
          <Link
            to="/forgot-password"
            className="text-center text-primary underline"
          >
            Forgot Password
          </Link>
        </div>
        <div className="w-full font-bold mx-4 px-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-center text-primary underline">
            Register Now!
          </Link>
        </div>

        <PrimaryButton type="submit" loading={loading} disabled={loading}>
          LOGIN
        </PrimaryButton>
      </form>
    </div>
  );
};

export default LoginCard;
