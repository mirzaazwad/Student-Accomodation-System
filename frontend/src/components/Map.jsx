import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapSearch = ({
  currentPosition = [51.505, -0.09],
  zoom = 13,
  onAddressSelect,
  showSearchBar = false,
  movePointer = false,
  initialAddress = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialAddress);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`
      );
      if (response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        onAddressSelect({ position: newPosition, address: display_name });
      } else {
        alert("No results found!");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (movePointer) {
          const { lat, lng } = e.latlng;
          reverseGeocode(lat, lng);
        }
      },
    });

    return currentPosition ? (
      <Marker position={currentPosition}></Marker>
    ) : null;
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      console.log(response.data);
      const address = response.data.display_name;
      onAddressSelect({ position: [lat, lng], address });
      setSearchQuery(address);
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {showSearchBar && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search for an address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type = "button"
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      )}
      <div className="lg:h-[250px] h-96 w-full rounded-lg overflow-hidden">
        <MapContainer
          center={currentPosition}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          latlng={currentPosition}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSearch;
