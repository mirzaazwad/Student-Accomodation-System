import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FavoriteAppartments = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  return (
    <div className="w-full md:w-5/6 mx-4 px-4 py-2 bg-white rounded-lg shadow-md my-4 overflow-x-auto scrollbar-hide">
      <h1 className="text-2xl font-semibold">Favorite Appartments</h1>
      <div className="flex gap-4 lg:flex-row flex-col justify-center items-center">
        {!user.favorites ||
          (user.favorites.length === 0 && (
            <div className="w-full m-4 p-4 bg-red-200 text-red-800 border border-red-800 text-center">
              You have not added any appartments to your favorites yet.
            </div>
          ))}
        {user.favorites &&
          user.favorites.map((appartment, index) => (
            <div
              key={index}
              className="w-[300px] p-4 flex-shrink-0 flex flex-col items-center gap-4 rounded-lg shadow-md justify-center items-start cursor-pointer"
              onClick={() => {
                navigate(`/appartments/${appartment.appartmentId}`);
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
  );
};

export default FavoriteAppartments;
