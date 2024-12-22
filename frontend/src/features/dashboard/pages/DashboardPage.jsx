import { useState } from "react";
import MapSearch from "../../../components/Map";

const DashboardPage = () => {
  const [address, setAddress] = useState("");
  return (
    <div>
      <h1>Dashboard</h1>
      <p>{address}</p>
      <MapSearch onAddressSelect={({ address }) => setAddress(address)} />
    </div>
  );
};

export default DashboardPage;
