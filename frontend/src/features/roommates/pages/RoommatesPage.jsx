import { useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const RoommatesPage = () => {
  const [currentTab, setCurrentTab] = useState("requests");

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };
  return (
    <div>
      <TabGroup className="flex flex-col justify-center items-center p-4">
        <TabList className="w-full border-b-2">
          <Tab
            onClick={() => handleTabChange("requests")}
            className={`p-4 ms-4 rounded-t-lg ${
              currentTab === "requests"
                ? "bg-primary-dark text-white"
                : "hover:bg-primary text-primary hover:text-white border-t-2 border-l-2 border-r-2 border-primary"
            }`}
          >
            Requests
          </Tab>
          <Tab
            onClick={() => handleTabChange(`current`)}
            className={`p-4 rounded-t-lg ${
              currentTab === "current"
                ? "bg-primary-dark text-white"
                : "hover:bg-primary text-primary hover:text-white border-t-2 border-l-2 border-r-2 border-primary"
            }`}
          >
            Current Roommates
          </Tab>
          <Tab
            onClick={() => handleTabChange(`find`)}
            className={`p-4 me-4 rounded-t-lg ${
              currentTab === "find"
                ? "bg-primary-dark text-white"
                : "hover:bg-primary text-primary hover:text-white border-t-2 border-l-2 border-r-2 border-primary"
            }`}
          >
            Find Roommates
          </Tab>
        </TabList>
        <TabPanels className="w-full">
          <TabPanel className={`w-full`}></TabPanel>
          <TabPanel className={`w-full`}></TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default RoommatesPage;
