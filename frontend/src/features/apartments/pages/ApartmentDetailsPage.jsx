import { useParams } from "react-router-dom";
import { useApartments } from "../hooks/useApartments";
import ReviewSection from "../components/ReviewSection";

const ApartmentDetailsPage = ({ userType }) => {
  const { id } = useParams(); // Get apartment ID from the URL.
  const {
    apartments,
    deleteApartment,
    updateApartment,
    addReview,
  } = useApartments();

  const apartment = apartments.find((apt) => apt.id === id);

  if (!apartment) {
    return <div className="text-center mt-10">Apartment not found</div>;
  }

  const handleDeleteApartment = () => {
    deleteApartment(apartment.id);
  };

  const handleUpdateApartment = (updatedData) => {
    updateApartment(apartment.id, updatedData);
  };

  const handleAddReview = (reviewText) => {
    addReview(apartment.id, { text: reviewText });
  };

  const handleDeleteReview = (reviewId) => {
    // Logic to delete a review (can be handled in the useApartments hook).
  };

  return (
    <div className="w-full p-4 flex flex-col items-start">
      <div className="w-full flex flex-col md:flex-row gap-6">
        <img
          src={apartment.image}
          alt={apartment.title}
          className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md"
        />
        <div className="flex flex-col w-full md:w-1/2">
          <h1 className="text-2xl font-semibold">{apartment.title}</h1>
          <p className="text-lg text-gray-600">{apartment.description}</p>
          <p className="text-gray-600 mt-2">Rent: {apartment.rent} BDT</p>
          {userType === "landlord" && (
            <div className="mt-4">
              <button
                onClick={handleDeleteApartment}
                className="px-4 py-2 bg-red-600 text-white rounded mr-2"
              >
                Delete Apartment
              </button>
              <button
                onClick={() =>
                  handleUpdateApartment({ title: "Updated Title" }) // Replace with an update form.
                }
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update Apartment
              </button>
            </div>
          )}
          {userType === "student" && (
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
              Book Apartment
            </button>
          )}
        </div>
      </div>

      <ReviewSection
        reviews={apartment.reviews || []}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
      />
    </div>
  );
};

export default ApartmentDetailsPage;
