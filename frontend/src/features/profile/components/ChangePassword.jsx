import Input from "../../../components/input/Input";
import { useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import LoadingComponent from "../../../components/LoadingComponent";
import IconButton from "../../../components/input/IconButton";
import { FaSave, FaTrashRestore } from "react-icons/fa";

const ChangePassword = () => {
  const initialValue = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(initialValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      await axios.patch("/user/change-password", formData);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;

  return (
    <form
      className="m-4 p-4 w-2/3 flex flex-col justify-end items-end rounded-lg shadow-lg"
      method="POST"
      onSubmit={handleSubmit}
    >
      <h1 className="w-full text-2xl font-bold">Change Password</h1>
      {error && <p className="text-red-500 text-lg font-semibold">{error}</p>}
      <Input
        className="text-2xl font-semibold"
        value={formData?.oldPassword}
        onChange={handleChange}
        name="oldPassword"
        id="oldPassword"
        label="Old Password"
        type="password"
      ></Input>
      <Input
        className="text-2xl font-semibold"
        value={formData?.newPassword}
        onChange={handleChange}
        name="newPassword"
        id="newPassword"
        label="New Password"
        type="password"
      ></Input>
      <Input
        className="text-2xl font-semibold"
        value={formData?.confirmPassword}
        onChange={handleChange}
        name="confirmPassword"
        id="confirmPassword"
        label="Confirm Password"
        type="password"
      ></Input>
      <div className="w-full flex flex-row gap-4 justify-end items-end">
        <IconButton type="submit" label="Save" className="w-[200px]">
          <FaSave />
        </IconButton>
        <IconButton
          type="button"
          label="Reset"
          className="w-[200px]"
          onClick={() => {
            setFormData(initialValue);
          }}
        >
          <FaTrashRestore />
        </IconButton>
      </div>
    </form>
  );
};

export default ChangePassword;
