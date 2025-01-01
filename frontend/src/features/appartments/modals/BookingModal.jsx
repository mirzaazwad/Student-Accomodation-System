import { useSelector } from "react-redux";
import PopupModal from "../../../components/PopupModal";
import Input from "../../../components/input/Input";
import Select from "../../../components/input/Select";
import { useEffect, useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import RoommateCard from "../components/RoommateCard";
import RangeSlider from "../../../components/input/RangeSlider";
import PrimaryButton from "../../../components/input/PrimaryButton";
import { closeModal } from "../../../utils/ModalHelper";
const BookingModal = () => {
  const id = useSelector((state) => state.modal.data).id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: new Date(),
    checkOut: new Date(),
  });
  const [roommates, setRoommates] = useState([]);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [preferences, setPreferences] = useState(
    user.roommateProfile.preferences
  );
  const [selectedRoommates, setSelectedRoommates] = useState([]);
  const [budget, setBudget] = useState(user.roommateProfile.budget);
  const [search, setSearch] = useState("");

  const handleBudgetChange = (value) => {
    setBudget({
      minRent: value.min,
      maxRent: value.max,
    });
  };

  const addRoommate = (roommate) => {
    setSelectedRoommates([...selectedRoommates, roommate]);
  };

  const removeRoommate = (roommate) => {
    setSelectedRoommates(selectedRoommates.filter((r) => r.id !== roommate.id));
  };

  const handlePreferenceChange = (e) => {
    setPreferences({ ...preferences, [e.target.id]: e.target.value });
  };

  const fetchPossibleRoommates = async () => {
    try {
      const response = await axios.post(`/user/roommates`, {
        preferences: preferences,
        budget: budget,
        search: search,
      });
      console.log(response);
      const roommates = response.data.topRoommates
        .map((roommate) => {
          if (roommate._id !== user.id) {
            return roommate;
          }
        })
        .filter((roommate) => roommate !== undefined);
      setRoommates(roommates);
    } catch (error) {
      setError(error.response.data.message || "Failed to fetch roommates");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const checkOutDate = new Date(formData.checkOut);
      const [year, month, day] = formData.checkIn.split("-");

      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}T23:59:00`;
      const checkInDate = new Date(formattedDate);

      if (checkInDate < new Date()) {
        setError("Check in date must be in the future");
        return;
      }
      if (checkInDate > checkOutDate) {
        setError("Check out date must be after check in date");
        return;
      }
      await axios.post(`/apartment/book/${id}`, {
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        roommates: selectedRoommates,
      });
      closeModal();
    } catch (error) {
      setError(error.response.data.message || "Failed to book apartment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPossibleRoommates();
  }, [id, preferences, budget, search]);

  return (
    <PopupModal title={"Book Apartment"}>
      <div className="w-full flex flex-col items-start justify-start gap-4">
        {error && (
          <p className="w-full text-red-500 text-sm text-center">{error}</p>
        )}
        <Input
          id="checkIn"
          label="Check In"
          placeholder="Add The Check In Date"
          type="date"
          onChange={handleChange}
          value={formData.checkIn}
        />
        <Input
          id="checkOut"
          label="Check Out"
          placeholder="Add The Check Out Date"
          type="date"
          onChange={handleChange}
          value={formData.checkOut}
        />
        <h1 className="w-full flex flex-row justify-start items-start text-2xl font-semibold mt-4">
          Top Roommates
        </h1>
        <div className="w-full py-2">
          <h1 className="w-full flex flex-row justify-start items-start text-lg font-semibold mt-4">
            Filters
          </h1>
          <Select
            id="cleanliness"
            label="Cleanliness"
            options={[
              {
                value: "very clean",
                label: "Very Clean",
              },
              {
                value: "moderately clean",
                label: "Moderately Clean",
              },
              {
                value: "no preference",
                label: "No Preference",
              },
            ]}
            value={preferences.cleanliness}
            onChange={handlePreferenceChange}
          />
          <Select
            id="lifestyle"
            label="Lifestyle"
            options={[
              {
                value: "quiet",
                label: "Quiet",
              },
              {
                value: "social",
                label: "Social",
              },
              {
                value: "no preference",
                label: "No Preference",
              },
            ]}
            value={preferences.lifestyle}
            onChange={handlePreferenceChange}
          />
          <Select
            id="gender"
            label="Gender"
            options={[
              {
                value: "male",
                label: "Male",
              },
              {
                value: "female",
                label: "Female",
              },
              {
                value: "no preference",
                label: "No Preference",
              },
            ]}
            value={preferences.gender}
            onChange={handlePreferenceChange}
          />
          <RangeSlider
            label="Budget"
            min={0}
            max={200000}
            onChange={handleBudgetChange}
          />
          <Input
            id="search"
            label="Search"
            placeholder="Search Roommates"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-row items-start justify-start gap-4 flex-wrap">
          {roommates &&
            roommates.map((roommate, index) => (
              <RoommateCard
                key={index}
                roommate={roommate}
                addRoommate={addRoommate}
                removeRoommate={removeRoommate}
              />
            ))}
        </div>
        <PrimaryButton type="button" disabled={loading} onClick={handleSubmit}>
          Book This Apartment
        </PrimaryButton>
      </div>
    </PopupModal>
  );
};

export default BookingModal;
