import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axios } from "../../../utils/RequestHandler";
import { filterActions } from "../../appartments/context/filter-slice";

export const useListings = () => {
  const [appartments, setListings] = useState([]);
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
  const [currentTab, setCurrentTab] = useState("booked");

  const fetchListings = async () => {
    try {
      const url = `/apartment/${currentTab}?limit=${limit}&page=${page}`;
      const additionalQuery = isSet ? createQuery(filter) : "";
      let query = url + additionalQuery;
      if (search) {
        query += `&search=${encodeURIComponent(search)}`;
      }
      console.log(filter);
      console.log(query);
      const response = await axios.get(query);
      setListings(response.data.apartments);
      setTotal(response.data.total);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    } finally {
      dispatch(filterActions.queryRun());
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
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
      setLoading(true);
      fetchListings();
    }
  }, [page, limit, search, isSet, runQuery, currentTab]);

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
    fetchListings,
    handleSearch,
    handleTabChange,
    setPage,
  };
};
