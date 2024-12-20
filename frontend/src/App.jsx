import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import ApartmentListing from "./pages/ApartmentListing";
import ApartmentDetails from "./components/Apartment/ApartmentDetails";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/apartments" element={<ApartmentListing />} /> */}
        <Route path="/apartments/:id" element={<ApartmentDetails />} />
        {/* <Route path="/roommates" element={<RoommateFinder />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
