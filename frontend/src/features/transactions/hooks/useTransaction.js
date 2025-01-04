import { useEffect, useState } from "react";
import { axios } from "../../../utils/RequestHandler";

export const useTransaction = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [transactions, setTransactions] = useState([]);

  const getTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `/transaction/fetch?page=${page}&limit=${limit}`
      );
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    } catch (error) {
      setError(
        error.response.data.message || "Failed to Retrieve Transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [page]);

  return {
    page,
    setPage,
    limit,
    error,
    total,
    loading,
    transactions,
  };
};
