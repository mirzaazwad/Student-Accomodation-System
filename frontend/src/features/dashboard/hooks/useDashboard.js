import { useEffect, useState } from "react";
import { axios } from "../../../utils/RequestHandler";

export const useDashboard = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState();
  const favoriteApparments = [
    {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoFNADfnbnEoqgqghmn4y7qR1uHaefN6y1KA&s",
      title: "Apartment 1",
      address: "Dhaka, Bangladesh",
      description: "This is a beautiful apartment",
      rent: 10000,
    },
    {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLZrCV9ggiDvDrsz1oG6EcIA_LME3EUZbLOA&s",
      title: "Apartment 2",
      address: "Dhaka, Bangladesh",
      description: "This is a beautiful apartment",
      rent: 10000,
    },
    {
      image:
        "https://www.shutterstock.com/image-photo/new-modern-block-flats-green-600nw-2371962675.jpg",
      title: "Apartment 3",
      address: "Dhaka, Bangladesh",
      description: "This is a beautiful apartment",
      rent: 10000,
    },
    {
      image: "https://thumbs.dreamstime.com/b/apartment-building-19532951.jpg",
      title: "Apartment 4",
      address: "Dhaka, Bangladesh",
      description: "This is a beautiful apartment",
      rent: 10000,
    },
    {
      image:
        "https://www.shutterstock.com/image-photo/new-modern-block-flats-green-600nw-2501530247.jpg",
      title: "Apartment 5",
      address: "Dhaka, Bangladesh",
      description: "This is a beautiful apartment",
      rent: 10000,
    },
    {
      image:
        "https://www.shutterstock.com/image-photo/new-modern-block-flats-green-600nw-2371962675.jpg",
      title: "Apartment 6",
      address: "Dhaka, Bangladesh",
      description: "This is a beautiful apartment",
      rent: 10000,
    },
    {
      image:
        "https://www.shutterstock.com/image-photo/new-modern-block-flats-green-600nw-2501530247.jpg",
      title: "Apartment 7",
      address: "Dhaka, Bangladesh",
      description: "This is a beautiful apartment",
      rent: 10000,
    },
  ];

  const handlePositionChange = (position) => {
    setSelectedAddress({ ...selectedAddress, position });
  };

  const fetchUserInformation = async () => {
    try {
      const response = await axios.get("/user/fetch");
      setUser(response.data.user);
      await getCurrentLocation();
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        handlePositionChange([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    } else {
      setSelectedAddress({
        position: [23.7544529, 90.393336],
        address:
          "Dhaka, Dhaka Metropolitan, Dhaka District, Dhaka Division, 2015, Bangladesh",
      });
      setError(
        "Geolocation is not supported by this browser, hence it is not showing current location, instead it is showing a default location"
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserInformation();
  }, []);

  return {
    error,
    loading,
    user,
    selectedAddress,
    setSelectedAddress,
    favoriteApparments,
  };
};
