import MapSearch from "../../../components/Map";
import { useDashboard } from "../hooks/useDashboard";
import LoadingComponent from "../../../components/LoadingComponent";
import ProfilePicture from "../../../components/input/ProfilePicture";
import { useSelector } from "react-redux";
import FavoriteAppartments from "../components/FavoriteAppartments";
import Bookings from "../components/Bookings";

const DashboardPage = () => {
  const {
    error,
    loading,
    selectedAddress,
    setSelectedAddress,
    favoriteApparments,
  } = useDashboard();
  const user = useSelector((state) => state.auth.user);

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="w-full h-full lg:mx-4 my-6 p-4 bg-white justify-center items-center flex flex-col">
      {error && (
        <div className="font-semibold w-full m-4 p-4 bg-red-200 text-red-800 border border-red-800 text-center">
          {error}
        </div>
      )}
      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 flex md:flex-row flex-col items-center gap-4 rounded-lg shadow-md">
          <ProfilePicture src={user?.profilePicture} disabled />
          <div className="w-1/2 flex flex-col items-start justify-start">
            <h1 className="text-2xl font-semibold">{user?.username}</h1>
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
        {selectedAddress && (
          <div className="w-full mx-4 lg:h-[350px] md:w-3/4 lg:w-1/2 px-4 py-2 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold">Your Current Location</h1>
            <div className="w-full">
              <MapSearch
                onAddressSelect={(value) => {
                  console.log(value);
                  setSelectedAddress(value);
                }}
                currentPosition={selectedAddress.position}
                zoom={13}
              />
            </div>
          </div>
        )}
      </div>
      {user.userType === "student" && (
        <FavoriteAppartments favoriteApparments={favoriteApparments} />
      )}
      <Bookings />
    </div>
  );
};

export default DashboardPage;
