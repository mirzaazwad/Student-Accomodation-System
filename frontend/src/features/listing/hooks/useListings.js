import { useEffect, useState } from "react";
import { axios } from "../../../utils/RequestHandler";

export const useListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [currentTab, setCurrentTab] = useState("booked");

  const fetchListings = async () => {
    try {
      setError("");
      setLoading(true);
      const query = `/apartment/fetch/${currentTab}?limit=${limit}&page=${page}`;
      const response = await axios.get(query);
      setListings(response.data.appartments);
      setTotal(response.data.total);
      setLoading(false);
      if (response.data.total === 0) {
        setError("No listings found");
      }
    } catch (error) {
      setListings([]);
      setTotal(0);
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    fetchListings();
  }, [page, limit, currentTab]);

  return {
    total,
    limit,
    error,
    loading,
    page,
    listings,
    fetchListings,
    currentTab,
    handleTabChange,
    setPage,
  };
};
