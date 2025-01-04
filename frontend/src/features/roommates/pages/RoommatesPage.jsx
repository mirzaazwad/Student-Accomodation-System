import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { axios } from "../../../utils/RequestHandler";
import LoadingComponent from "../../../components/LoadingComponent";
import RoommateCard from "../components/RoommateCard";

const RoommatesPage = () => {
  const [currentTab, setCurrentTab] = useState("requestee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/request/${currentTab}`);
      if (currentTab === "requestee") {
        setRequests(
          response.data.requests.map((request) => {
            return {
              ...request.requester,
              appartmentId: request.apartment,
              status: request.status,
              requestId: request._id,
            };
          })
        );
      } else {
        setRequests(
          response.data.requests.map((request) => {
            return {
              ...request.requestee,
              appartmentId: request.apartment,
              status: request.status,
              requestId: request._id,
            };
          })
        );
      }
    } catch (error) {
      setError(error.response.data.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    fetchRequests();
  }, [currentTab]);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <TabGroup className="flex flex-col justify-center items-center p-4">
        <TabList className="w-full border-b-2">
          <Tab
            id="requestee"
            onClick={() => handleTabChange("requestee")}
            className={`p-4 ms-4 rounded-t-lg ${
              currentTab === "requestee"
                ? "bg-primary-dark text-white"
                : "hover:bg-primary text-primary hover:text-white border-t-2 border-l-2 border-r-2 border-primary"
            }`}
          >
            Requests
          </Tab>
          <Tab
            id="requester"
            onClick={() => handleTabChange(`requester`)}
            className={`p-4 rounded-t-lg ${
              currentTab === "requester"
                ? "bg-primary-dark text-white"
                : "hover:bg-primary text-primary hover:text-white border-t-2 border-l-2 border-r-2 border-primary"
            }`}
          >
            Requested Roommates
          </Tab>
        </TabList>
        {error && (
          <p className="w-full text-red-500 text-sm text-center">{error}</p>
        )}
        <TabPanels className="w-full">
          <TabPanel className={`w-full`}>
            {requests.map((request, index) => (
              <RoommateCard
                key={index}
                request={request}
                showAccept={
                  currentTab === "requestee" && request.status === "Pending"
                }
              />
            ))}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default RoommatesPage;
