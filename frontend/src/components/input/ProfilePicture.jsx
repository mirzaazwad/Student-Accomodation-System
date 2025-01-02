import { useRef, useState } from "react";
import LoadingComponent from "../LoadingComponent";
import { axios } from "../../utils/RequestHandler";
import { FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../context/auth.slice";

const ProfilePicture = (props) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(props.src ?? "/profile-picture.png");
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
      const response = await axios.post("/user/add-profile-picture", formData);
      dispatch(
        authActions.setUser({
          ...user,
          profilePicture: response.data.profilePicture,
        })
      );
      setImageUrl(response.data.profilePicture);
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
          className={`w-full h-full object-cover rounded-full border-4 ${
            user.userType === "landlord" || props.isLandlord
              ? "border-green-600"
              : "border-primary"
          } shadow-lg`}
        />
        <label
          htmlFor="fileInput"
          className={`absolute bottom-0 right-0 ${
            user.userType === "landlord" || props.isLandlord
              ? "bg-green-600"
              : "bg-primary"
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
