import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axios } from "../../../utils/RequestHandler";

export const useAppartments = () => {
  const user = useSelector((state) => state.auth.user);
  const [appartments, setAppartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchAppartments = async () => {
    try {
      const response = await axios.get(
        `/apartment?limit=${limit}&page=${page}`
      );
      setAppartments(response.data.apartments);
      setTotal(response.data.total);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppartments();
  }, [page, limit, search]);

  const isLandlord = user?.userType === "landlord";

  return {
    isLandlord,
    total,
    limit,
    error,
    loading,
    page,
    appartments,
    setSearch,
    setPage,
  };
};
