import { useRef, useState } from "react";
import LoadingComponent from "../LoadingComponent";
import { axios } from "../../utils/RequestHandler";
import { FaCamera } from "react-icons/fa";
import { useSelector } from "react-redux";

const ProfilePicture = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [imageUrl, setImageUrl] = useState(props.src || "/default-avatar.png"); // Fallback for default avatar
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setLoading(true);
    setImageUrl(URL.createObjectURL(selectedFile));
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await axios.post("/user/add-profile-picture", formData);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;

  return (
    <div className="w-1/2 flex flex-col items-end justify-end p-4 m-4">
      <div className={`relative w-[200px] h-[200px]`}>
        <img
          src={imageUrl}
          alt="Profile Preview"
          className={`w-full h-full object-cover rounded-full border-4 border-${
            user.userType === "landlord" ? "green-400" : "primary"
          } shadow-lg`}
        />
        <label
          htmlFor="fileInput"
          className={`absolute bottom-0 right-0 bg-${
            user.userType === "landlord" ? "green-400" : "primary"
          } text-white rounded-full p-2 cursor-pointer hover:bg-primary-dark shadow-md`}
          title="Upload Image"
        >
          <FaCamera
            size="36px"
            className={`${props.disabled ? "hidden" : ""}`}
          />
        </label>
      </div>
      <input
        ref={imageRef}
        id="fileInput"
        type="file"
        onChange={handleChange}
        accept="image/*"
        className="hidden"
        disabled={props.disabled}
      />
    </div>
  );
};

export default ProfilePicture;
