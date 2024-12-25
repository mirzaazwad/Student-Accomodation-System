const ApartmentCard = ({ apartment, onClick }) => {
    return (
      <div
        className="w-[300px] p-4 flex flex-col items-center gap-4 rounded-lg shadow-md cursor-pointer"
        onClick={onClick}
      >
        <img
          src={apartment.image}
          alt="apartment"
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="w-full flex flex-col items-start justify-start">
          <h1 className="text-xl font-semibold">{apartment.title}</h1>
          <p className="text-gray-600">{apartment.description}</p>
          <p className="text-gray-600">Rent: {apartment.rent} BDT</p>
        </div>
      </div>
    );
  };
  
  export default ApartmentCard;
  