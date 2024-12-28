import MapSearch from "../../../components/Map";
import { useDashboard } from "../hooks/useDashboard";
import LoadingComponent from "../../../components/LoadingComponent";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const {
    error,
    loading,
    user,
    selectedAddress,
    setSelectedAddress,
    favoriteApparments,
  } = useDashboard();
  const navigate = useNavigate();

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
          <div className="w-1/2 flex flex-col items-center justify-center">
            <img
              src={user?.profilePicture ?? "/profile-picture.png"}
              alt="avatar"
              className="w-[200px] h-[200px] rounded-full"
            />
          </div>
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
      <div className="w-full md:w-5/6 mx-4 px-4 py-2 bg-white rounded-lg shadow-md my-4 overflow-x-auto scrollbar-hide">
        <h1 className="text-2xl font-semibold">Favorite Appartments</h1>
        <div className="flex gap-4 lg:flex-row flex-col justify-center items-center">
          {favoriteApparments.map((appartment, index) => (
            <div
              key={index}
              className="w-[300px] p-4 flex-shrink-0 flex flex-col items-center gap-4 rounded-lg shadow-md justify-center items-start cursor-pointer"
              onClick={() => {
                navigate(`/appartments/${appartment.id}`);
              }}
            >
              <div className="w-full">
                <img
                  src={appartment.image}
                  alt="appartment"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="w-full flex flex-col items-start justify-start">
                <h1 className="text-xl font-semibold">{appartment.title}</h1>
                <h2 className="text-lg font-semibold">{appartment.address}</h2>
                <p className="text-gray-600">{appartment.description}</p>
                <p className="text-gray-600">Rent: {appartment.rent} BDT</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
