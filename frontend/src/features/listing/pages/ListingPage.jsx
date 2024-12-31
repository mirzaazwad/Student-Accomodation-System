import { useListings } from "../hooks/useListings";
import ListingCard from "../components/ListingCard";
import Pagination from "../../../components/Pagination";
import LoadingComponent from "../../../components/LoadingComponent";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { openModal } from "../../../utils/ModalHelper";
import { modalTypes } from "../../../context/modal.slice";
import IconButton from "../../../components/input/IconButton";
import { FaPlus } from "react-icons/fa";

const ListingPage = () => {
  const {
    error,
    listings,
    loading,
    currentTab,
    limit,
    page,
    total,
    setPage,
    handleTabChange,
  } = useListings();

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="w-full h-full">
      <div className="w-full p-4 flex justify-end items-end">
        <IconButton
          label="Add Apartment"
          onClick={() => openModal(modalTypes.ADD_APARTMENT)}
        >
          <FaPlus />
        </IconButton>
      </div>
      <TabGroup className="flex flex-col justify-center items-center">
        <TabList className="w-full border-b-2">
          <Tab
            onClick={() => handleTabChange("booked")}
            className={`p-4 ms-4 rounded-t-lg ${
              currentTab === "booked"
                ? "bg-primary-dark text-white"
                : "hover:bg-primary text-primary hover:text-white border-t-2 border-l-2 border-r-2 border-primary"
            }`}
          >
            Booked
          </Tab>
          <Tab
            onClick={() => handleTabChange(`available`)}
            className={`p-4 me-4 rounded-t-lg ${
              currentTab === "available"
                ? "bg-primary-dark text-white"
                : "hover:bg-primary text-primary hover:text-white border-t-2 border-l-2 border-r-2 border-primary"
            }`}
          >
            Available
          </Tab>
        </TabList>
        {error && (
          <div className="w-5/6 m-4 p-4 text-lg bg-red-200 text-red-600 border border-red-600">
            {error}
          </div>
        )}
        <TabPanels className="w-full">
          <TabPanel className={`w-full`}>
            <div className="w-full h-full">
              <div className="w-full px-4 py-4 mx-auto flex justify-center items-center">
                <Pagination
                  totalPages={total}
                  page={page}
                  limit={limit}
                  siblingCount={1}
                  onPageChange={(page) => setPage(page)}
                />
              </div>

              <div className="w-full h-full px-4 flex flex-col gap-6 items-center">
                {listings &&
                  listings.map((appartment, index) => (
                    <ListingCard key={index} appartment={appartment} />
                  ))}
              </div>
            </div>
          </TabPanel>
          <TabPanel className={`w-full`}>
            <div className="w-full h-full">
              <div className="w-full px-4 py-4 mx-auto flex justify-center items-center">
                <Pagination
                  totalPages={total}
                  page={page}
                  limit={limit}
                  siblingCount={1}
                  onPageChange={(page) => setPage(page)}
                />
              </div>

              <div className="w-full h-full px-4  flex flex-col gap-6 items-center">
                {listings &&
                  listings.map((appartment, index) => (
                    <ListingCard key={index} appartment={appartment} />
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
