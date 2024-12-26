import { useAppartments } from "../hooks/useAppartments";
import AppartmentCard from "../components/AppartmentCard";
import SearchBar from "../../../components/input/SearchBar";
import FilterButton from "../../../components/input/FilterButton";
import Pagination from "../../../components/Pagination";
import LoadingComponent from "../../../components/LoadingComponent";
import { modalTypes } from "../../../context/slices/modal.slice";
import { openModal } from "../../../utils/ModalHelper";

const AppartmentPage = () => {
  const {
    appartments,
    isLandlord,
    loading,
    limit,
    page,
    total,
    search,
    setSearch,
    setPage,
  } = useAppartments();

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="w-full h-screen">
      <div className="px-4 py-4 flex gap-2 items-center">
        <SearchBar
          placeholder="Search for apartment"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterButton onClick={() => openModal(modalTypes.FILTER)} />
      </div>
      {isLandlord && (
        <div className="px-4 flex justify-start items-start">
          <button className="mx-4 px-4 py-2 bg-primary rounded-lg text-white font-bold">
            Add Apartment
          </button>
        </div>
      )}
      <div className="w-full px-4 py-4 mx-auto flex justify-center items-center">
        <Pagination
          totalPages={total}
          page={page}
          limit={limit}
          siblingCount={1}
          onPageChange={(page) => setPage(page)}
        />
      </div>

      <div className="w-full h-full px-4 flex flex-wrap gap-6">
        {appartments &&
          appartments.map((appartment, index) => (
            <AppartmentCard key={index} appartment={appartment} />
          ))}
      </div>
    </div>
  );
};

export default AppartmentPage;
