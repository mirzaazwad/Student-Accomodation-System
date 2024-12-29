import { useListings } from "../hooks/useListings";
import AppartmentCard from "../components/AppartmentCard";
import SearchBar from "../../../components/input/SearchBar";
import FilterButton from "../../../components/input/FilterButton";
import Pagination from "../../../components/Pagination";
import LoadingComponent from "../../../components/LoadingComponent";
import { modalTypes } from "../../../context/modal.slice";
import { openModal } from "../../../utils/ModalHelper";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const ListingPage = () => {
  const {
    appartments,
    loading,
    limit,
    page,
    total,
    search,
    handleSearch,
    setPage,
    fetchListings,
    handleTabChange,
  } = useListings();

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="w-full h-screen">
      <TabGroup>
        <TabList>
          <Tab onClick={() => handleTabChange("booked")}>Booked</Tab>
          <Tab onClick={() => handleTabChange("available")}>Available</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="w-full h-screen">
              <form
                className="px-4 py-4 flex gap-2 items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchListings();
                }}
              >
                <SearchBar
                  placeholder="Search for apartment"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <FilterButton
                  type="button"
                  onClick={() => openModal(modalTypes.FILTER)}
                />
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
          </TabPanel>
          <TabPanel>
            <div className="w-full h-screen">
              <form
                className="px-4 py-4 flex gap-2 items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchListings();
                }}
              >
                <SearchBar
                  placeholder="Search for apartment"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <FilterButton
                  type="button"
                  onClick={() => openModal(modalTypes.FILTER)}
                />
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
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default ListingPage;
