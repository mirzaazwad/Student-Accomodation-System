import { useState, useEffect } from "react";
import { axios } from "../../../utils/RequestHandler";

export const useApartments = () => {
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/apartments");
      setApartments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch apartments");
    } finally {
      setLoading(false);
    }
  };

  const registerApartment = async (apartmentData) => {
    try {
      const response = await axios.post("/apartments", apartmentData);
      setApartments([...apartments, response.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register apartment");
    }
  };

  const deleteApartment = async (apartmentId) => {
    try {
      await axios.delete(`/apartments/${apartmentId}`);
      setApartments(apartments.filter((apt) => apt.id !== apartmentId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete apartment");
    }
  };

  const updateApartment = async (apartmentId, updatedData) => {
    try {
      const response = await axios.put(`/apartments/${apartmentId}`, updatedData);
      setApartments(
        apartments.map((apt) =>
          apt.id === apartmentId ? { ...apt, ...response.data } : apt
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update apartment");
    }
  };

  const addReview = async (apartmentId, review) => {
    try {
      const response = await axios.post(`/apartments/${apartmentId}/reviews`, review);
      const updatedApartments = apartments.map((apt) => {
        if (apt.id === apartmentId) {
          return { ...apt, reviews: [...apt.reviews, response.data] };
        }
        return apt;
      });
      setApartments(updatedApartments);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add review");
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return {
    apartments,
    error,
    loading,
    fetchApartments,
    registerApartment,
    deleteApartment,
    updateApartment,
    addReview,
  };
};
