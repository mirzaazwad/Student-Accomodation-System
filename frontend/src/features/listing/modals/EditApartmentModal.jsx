import { useEffect, useState } from "react";
import MapSearch from "../../../components/Map";
import PopupModal from "../../../components/PopupModal";
import Select from "../../../components/input/Select";
import Input from "../../../components/input/Input";
import TextArea from "../../../components/input/TextArea";
import PrimaryButton from "../../../components/input/PrimaryButton";
import { closeModal } from "../../../utils/ModalHelper";
import MultiImageUpload from "../components/MultiImageUpload";
import LoadingComponent from "../../../components/LoadingComponent";
import { useSelector } from "react-redux";
import { axios } from "../../../utils/RequestHandler";
import { useNavigate } from "react-router-dom";

const EditApartmentModal = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const id = useSelector((state) => state.modal.data).id;
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rent: "",
    amenities: "",
    roomType: "Single",
    location: {
      type: "Point",
      coordinates: [23.801417, 90.404926],
      address: "Banani, Dhaka",
    },
  });

  const [onAddressSelect, setOnAddressSelect] = useState({
    position: [23.801417, 90.404926],
    address: "Banani, Dhaka",
  });

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

  const fetchApartmentDetails = async () => {
    try {
      setLoading(true);
      setPreviews([]);
      const response = await axios.get(`/apartment/${id}`);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        rent: response.data.rent,
        roomType: response.data.roomType,
        amenities: response.data.amenities.join(","),
        location: response.data.location,
      });
      setOnAddressSelect({
        position: [
          response.data.location.coordinates.coordinates[0],
          response.data.location.coordinates.coordinates[1],
        ],
        address: response.data.location.address,
      });
      response.data.images.map((image) =>
        setPreviews((prev) => [...prev, image])
      );
    } catch (error) {
      setError(
        error.response.data.message || "Failed to fetch appartment details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    try {
      setError("");
      e.preventDefault();
      setLoading(true);
      await axios.put(`/apartment/${id}`, formData);
      if (files.length > 0) {
        const fileData = new FormData();
        files.forEach((file) => {
          fileData.append("files", file);
        });
        console.log(files, fileData);
        await axios.patch(`/apartment/images/${id}`, fileData);
      }
      setLoading(false);
      closeModal();
      navigate("/listing");
    } catch (error) {
      setError(error.response?.data.message ?? "Failed to update apartment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartmentDetails();
  }, [id]);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <PopupModal title={"Edit Apartment"}>
      <form
        method="POST"
        className="w-full h-full flex flex-col items-center justify-center"
        onSubmit={handleUpdate}
      >
        {error && (
          <div className="w-full m-4 p-4 bg-red-200 text-red-800 border border-red-800 text-center">
            {error}
          </div>
        )}
        <Input
          label="Title"
          name="title"
          id="title"
          placeholder="Title of the Apartment"
          value={formData.title}
          onChange={handleChange}
        />
        <TextArea
          label="Description"
          placeholder="Describe the Apartment"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Input
          label="Rent"
          placeholder="Enter Rent in BDT"
          id="rent"
          name="rent"
          value={formData.rent}
          onChange={handleChange}
        />

        <Input
          label="Amenities"
          placeholder="Add Ameneties seperated by comma(,)"
          id="amenities"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
        />
        <Select
          id="roomType"
          label="Room Type"
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
          options={[
            {
              label: "Single",
              value: "Single",
            },
            {
              label: "Shared",
              value: "Shared",
            },
            {
              label: "Studio",
              value: "Studio",
            },
            {
              label: "Other",
              value: "Other",
            },
          ]}
        ></Select>
        <div className="w-full m-4 p-4">
          <label htmlFor="address" className="text-gray-700 font-semibold my-2">
            Location
          </label>
          <MapSearch
            movePointer
            showSearchBar
            currentPosition={onAddressSelect.position}
            onAddressSelect={handleAddressChange}
            zoom={10}
            initialAddress={onAddressSelect.address}
          />
        </div>
        <MultiImageUpload
          files={files}
          onFilesChange={setFiles}
          initialPreviews={previews}
        />
        <PrimaryButton type="submit" className="w-full">
          Edit Apartment
        </PrimaryButton>
      </form>
    </PopupModal>
  );
};

export default EditApartmentModal;
