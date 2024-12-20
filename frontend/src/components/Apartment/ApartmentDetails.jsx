import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/api"; 

const ApartmentDetails = () => {
  const { id } = useParams(); 
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchApartmentDetails = async () => {
      try {
        const response = await axios.get(`/apartments/${id}`);
        setApartment(response.data);
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch apartment details.");
        setLoading(false);
      }
    };

    fetchApartmentDetails();
  }, [id]);

  if (loading) {
    return <div>Loading apartment details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="apartment-details">
      <h1>{apartment.title}</h1>
      <img src={apartment.image} alt={apartment.title} style={{ maxWidth: "100%" }} />
      <p><strong>Location:</strong> {apartment.location}</p>
      <p><strong>Price:</strong> ${apartment.price} per month</p>
      <p><strong>Description:</strong> {apartment.description}</p>
      <p><strong>Room Type:</strong> {apartment.roomType}</p>
      <button onClick={() => alert("Feature not implemented yet!")}>
        Contact Landlord
      </button>
    </div>
  );
};

export default ApartmentDetails;