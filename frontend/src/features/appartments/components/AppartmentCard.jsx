import { useNavigate } from "react-router-dom";

const AppartmentCard = ({ appartment }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-[350px] h-[500px] p-4 flex-shrink-0 flex flex-col items-center gap-4 rounded-lg shadow-md justify-start items-start cursor-pointer"
      onClick={() => {
        navigate(`/appartments/${appartment.id}`);
      }}
    >
      <div className="w-full">
        <img
          src={appartment.images[0]}
          alt="appartment"
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
      <div className="w-full flex flex-col items-start justify-start">
        <h1 className="text-xl font-semibold">{appartment.title}</h1>
        <h2 className="text-lg font-semibold">{appartment.location.address}</h2>
        <p className="text-gray-600">{appartment.description}</p>
        <p className="text-gray-600">Rent: {appartment.rent} BDT</p>
      </div>
    </div>
  );
};

export default AppartmentCard;
