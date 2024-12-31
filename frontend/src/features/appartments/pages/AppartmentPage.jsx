import { useAppartments } from "../hooks/useAppartments";
import AppartmentCard from "../components/AppartmentCard";
import SearchBar from "../../../components/input/SearchBar";
import Pagination from "../../../components/Pagination";
import LoadingComponent from "../../../components/LoadingComponent";
import { modalTypes } from "../../../context/modal.slice";
import { openModal } from "../../../utils/ModalHelper";
import IconButton from "../../../components/input/IconButton";
import { FaFilter } from "react-icons/fa";

const AppartmentPage = () => {
  const {
    appartments,
    loading,
    limit,
    page,
    total,
    search,
    handleSearch,
    setPage,
    fetchAppartments,
  } = useAppartments();

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="w-full h-screen">
      <form
        className="px-4 py-4 flex gap-2 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          fetchAppartments();
        }}
      >
        <SearchBar
          placeholder="Search for apartment"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <IconButton
          label="Filter"
          onClick={() => openModal(modalTypes.FILTER)}
          className="my-2"
        >
          <FaFilter />
        </IconButton>
        <button className="hidden" type="submit"></button>
      </form>
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
