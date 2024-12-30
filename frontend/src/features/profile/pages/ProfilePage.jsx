// import { useState } from "react";
import { useSelector } from "react-redux";
import UpdateBasicInformation from "../components/UpdateBasicInformation";
import ChangePassword from "../components/ChangePassword";
import RoommateProfile from "../components/RoommateProfile";
import ProfilePicture from "../../../components/input/ProfilePicture";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full mx-4 flex md:flex-row flex-col justify-center items-center gap-4 rounded-lg shadow-md">
        <ProfilePicture src={user?.profilePicture} />
        <div className="w-1/2 flex flex-col items-start justify-start">
          <h2 className="text-lg font-semibold">{user?.email}</h2>
          <p
            className={`text-white ${
              user?.userType === "landlord" ? "bg-green-600" : "bg-blue-600"
            } px-4 py-1 rounded-lg my-4`}
          >
            {user?.userType}
          </p>
        </div>
      </div>
      <UpdateBasicInformation />
      {user.userType === "student" && <RoommateProfile />}
      <ChangePassword />
    </div>
  );
};

export default ProfilePage;
