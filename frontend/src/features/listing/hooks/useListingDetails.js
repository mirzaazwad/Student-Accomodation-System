import { useEffect, useState } from "react";
import { axios } from "../../../utils/RequestHandler";

export const useListingDetails = (id) => {
  const [appartment, setAppartment] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchAppartmentDetails = async () => {
    try {
      const response = await axios.get(`/apartment/${id}`);
      setAppartment(response.data);
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

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/apartment/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      setError(
        error.response.data.message || "Failed to fetch appartment reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppartmentDetails();
    fetchReviews();
  }, []);

  return {
    error,
    loading,
    appartment,
    selectedAddress,
    reviews,
  };
};
