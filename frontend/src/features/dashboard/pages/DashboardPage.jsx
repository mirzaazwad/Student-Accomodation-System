import { useState } from "react";
import MapSearch from "../../../components/Map";

const DashboardPage = () => {
  const [selectedAddress, setSelectedAddress] = useState({
    position: [23.7544529, 90.393336],
    address:
      "Dhaka, Dhaka Metropolitan, Dhaka District, Dhaka Division, 2015, Bangladesh",
  });
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Selected address: {selectedAddress.address}</p>
      <p>Selected position: {selectedAddress.position.join(", ")}</p>
      <MapSearch
        onAddressSelect={(value) => {
          console.log(value);
          setSelectedAddress(value);
        }}
        initialPosition={selectedAddress.position}
        zoom={10}
      />
    </div>
  );
};

export default DashboardPage;
