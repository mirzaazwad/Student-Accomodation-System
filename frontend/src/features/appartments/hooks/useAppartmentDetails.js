import { useEffect, useState } from "react";
import { axios } from "../../../utils/RequestHandler";

export const useAppartmentDetails = (id) => {
  const [appartment, setAppartment] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchAppartmentDetails = async () => {
    try {
      const response = await axios.get(`/apartment/${id}`);
      setAppartment(response.data);
      console.log(response.data);
      setSelectedAddress({
        position: [
          response.data.location.coordinates.coordinates[0],
          response.data.location.coordinates.coordinates[1],
        ],
        address: response.data.location.address,
      });
    } catch (error) {
      setError(
        error.response.data.message || "Failed to fetch appartment details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppartmentDetails();
  }, []);

  return {
    error,
    loading,
    appartment,
    selectedAddress,
  };
};
