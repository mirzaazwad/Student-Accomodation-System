import { useSelector } from "react-redux";
import Input from "../../../components/input/Input";
import MapSearch from "../../../components/Map";
import ResetButton from "./ResetButton";
import SaveButton from "./SaveButton";
import { useState } from "react";
import LoadingComponent from "../../../components/LoadingComponent";
import { axios } from "../../../utils/RequestHandler";

const UpdateBasicInformation = () => {
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState(user);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onAddressSelect, setOnAddressSelect] = useState(
    user.location
      ? {
          position: [
            user.location.coordinates.coordinates[0],
            user.location.coordinates.coordinates[1],
          ],
          address: user.location.address,
        }
      : {
          position: [23.801417, 90.404926],
          address: "Banani, Dhaka",
        }
  );

  const handleAddressChange = (address) => {
    setOnAddressSelect(address);
    setFormData({
      ...formData,
      location: {
        type: "Point",
        coordinates: {
          type: "Point",
          coordinates: [address.position[0], address.position[1]],
        },
        address: address.address,
      },
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await axios.patch("/user/update-profile", formData);
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
      <h1 className="w-full text-2xl font-bold">Update Basic Information</h1>
      {error && <p className="text-red-500 text-lg font-semibold">{error}</p>}
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
          movePointer
          showSearchBar
          currentPosition={onAddressSelect.position}
          zoom={13}
          onAddressSelect={handleAddressChange}
          initialAddress={onAddressSelect.address}
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
