import { useEffect, useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import { useDispatch, useSelector } from "react-redux";
import { reviewActions } from "../context/review-slice";
import { useNavigate } from "react-router-dom";

export const useAppartmentDetails = (id) => {
  const [appartment, setAppartment] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.review.reviews);
  const navigate = useNavigate();

  const addToFavorites = async () => {
    try {
      if (!appartment.isFavorite) {
        await axios.post(`/user/add-favorite-apartment`, { apartmentId: id });
        setAppartment({ ...appartment, isFavorite: true });
      } else {
        await axios.post(`/user/remove-favorite-apartment`, {
          apartmentId: id,
        });
        setAppartment({ ...appartment, isFavorite: false });
      }
    } catch (error) {
      setError(
        error.response.data.message || "Failed to add appartment to favorites"
      );
    }
  };

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
      console.log(error);
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
      dispatch(reviewActions.setReviews(response.data));
    } catch (error) {
      setError(
        error.response.data.message || "Failed to fetch appartment reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSession = async (receiverId) => {
    setLoading(true);
    try {
      const response = await axios.post(`/message/session`, {
        receiverId,
      });
      navigate(`/chat?id=${response.data.sessionId}`);
    } catch (error) {
      setError(error.response.data.message || "Failed to create session");
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
    addToFavorites,
    fetchSession,
    reviews,
  };
};
