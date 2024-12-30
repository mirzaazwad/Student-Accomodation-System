import { useSelector } from "react-redux";
import Input from "../../../components/input/Input";
import MapSearch from "../../../components/Map";
import ResetButton from "./ResetButton";
import SaveButton from "./SaveButton";
import { useState } from "react";

const UpdateBasicInformation = () => {
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="m-4 p-4 w-2/3 flex flex-col justify-end items-end rounded-lg shadow-lg">
      <h1 className="w-full text-2xl font-bold">Update Basic Information</h1>
      <Input
        className="text-2xl font-semibold"
        value={formData?.username}
        onChange={handleChange}
        name="username"
        id="username"
        label="Username"
      ></Input>
      <div className="w-full">
        <div className="text-gray-700 font-semibold">Address</div>
        <MapSearch
          onAddressSelect={(value) => {
            console.log(value);
          }}
          movePointer
          showSearchBar
          currentPosition={formData.position}
          zoom={13}
        />
      </div>
      <div className="w-full flex flex-row gap-4 justify-end items-end">
        <SaveButton className="w-[200px]" />
        <ResetButton className="w-[200px]" />
      </div>
    </form>
  );
};

export default UpdateBasicInformation;
