import { useApartments } from "../hooks/useApartments";
import ApartmentCard from "../components/ApartmentCard";
import ApartmentForm from "../components/ApartmentForm";

const ApartmentsPage = ({ userType }) => {
  const {
    apartments,
    loading,
    error,
    registerApartment,
    deleteApartment,
    updateApartment,
  } = useApartments();

  const handleFormSubmit = (formData) => {
    registerApartment(formData);
  };

  return (
    <div className="w-full p-4">
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {userType === "landlord" && <ApartmentForm onSubmit={handleFormSubmit} />}
          <div className="flex flex-wrap gap-4">
            {apartments.map((apt) => (
              <ApartmentCard
                key={apt.id}
                apartment={apt}
                onClick={() => console.log(`Navigate to ${apt.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentsPage;
