import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axios } from "../../../utils/RequestHandler";
import { filterActions } from "../context/filter-slice";

export const useAppartments = () => {
  const [appartments, setAppartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;
  const filter = useSelector((state) => state.filter);
  const isSet = useSelector((state) => state.filter.set);
  const dispatch = useDispatch();
  const runQuery = useSelector((state) => state.filter.runQuery);

  const fetchAppartments = async () => {
    try {
      const url = `/apartment?limit=${limit}&page=${page}`;
      const additionalQuery = isSet ? createQuery(filter) : "";
      let query = url + additionalQuery;
      if (search) {
        query += `&search=${encodeURIComponent(search)}`;
      }
      console.log(filter);
      console.log(query);
      const response = await axios.get(query);
      setAppartments(response.data.apartments);
      setTotal(response.data.total);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    } finally {
      dispatch(filterActions.queryRun());
    }
  };

  const createQuery = (query) => {
    let queryString = "";
    for (let key in query) {
      if (query[key] && key === "location") {
        queryString += `&lat=${query[key].position[0]}&lng=${query[key].position[1]}`;
        continue;
      }
      if (query[key]) {
        queryString += `&${key}=${query[key]}`;
      }
    }
    return queryString;
  };

  const handleSearch = (e) => {
    setSearch(e);
    dispatch(filterActions.setQueryRun());
  };

  useEffect(() => {
    if (runQuery) {
      fetchAppartments();
    }
  }, [page, limit, search, isSet, runQuery]);

  useEffect(() => {
    dispatch(filterActions.setQueryRun());
  }, []);

  return {
    total,
    limit,
    error,
    loading,
    page,
    appartments,
    fetchAppartments,
    handleSearch,
    setPage,
  };
};
