import { Link } from "react-router-dom";
import Input from "../../../components/input/Input";
import PrimaryButton from "../../../components/input/PrimaryButton";
import Select from "../../../components/input/Select";
import LoadingComponent from "../../../components/LoadingComponent";
import { useRegister } from "../hooks/useRegister";

const RegisterCard = () => {
  const { formData, error, handleChange, handleSubmit, loading } =
    useRegister();
  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="w-full lg:w-2/3 h-full flex flex-col lg:m-4 m-0 lg:p-4 p-2 bg-white rounded-lg shadow-md">
      {error && (
        <div className="font-semibold w-full m-4 p-4 bg-red-200 text-red-800 border border-red-800 text-center">
          {error}
        </div>
      )}
      <form className="w-full m-4 p-4" onSubmit={handleSubmit}>
        <Input
          value={formData.email}
          onChange={handleChange}
          placeholder={"someone@example.com"}
          id="email"
          type="email"
          label="Email"
        />
        <Input
          value={formData.username}
          onChange={handleChange}
          placeholder={"enter a username"}
          id="username"
          type="text"
          label="Username"
        />
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
        <Select
          label={"User Type"}
          onChange={handleChange}
          value={formData.userType}
          id="userType"
          options={[
            { value: "student", label: "Student" },
            { value: "landlord", label: "Landlord" },
          ]}
        ></Select>
        <div className="w-full font-bold m-4 p-4">
          Already have an account?{" "}
          <Link to="/login" className="text-center text-primary underline">
            Login
          </Link>
        </div>
        <PrimaryButton type="submit" loading={loading} disabled={loading}>
          REGISTER
        </PrimaryButton>
      </form>
    </div>
  );
};

export default RegisterCard;
