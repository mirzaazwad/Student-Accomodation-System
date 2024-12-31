import { useSelector } from "react-redux";
import RangeSlider from "../../../components/input/RangeSlider";
import Select from "../../../components/input/Select";
import LoadingComponent from "../../../components/LoadingComponent";
import { useState } from "react";
import { axios } from "../../../utils/RequestHandler";
import IconButton from "../../../components/input/IconButton";
import { FaSave } from "react-icons/fa";

const RoommateProfile = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    preferences: {
      gender: user?.roommateProfile?.preferences.gender ?? "no preference",
      lifestyle:
        user?.roommateProfile?.preferences.lifestyle ?? "no preference",
      cleanliness:
        user?.roommateProfile?.preferences?.cleanliness ?? "no preference",
    },
    budget: {
      minRent: user?.roommateProfile?.budget?.minRent ?? 0,
      maxRent: user?.roommateProfile?.budget?.maxRent ?? 200000,
    },
  });

  const handleRangeChange = (values) => {
    setFormData({
      ...formData,
      budget: {
        minRent: values.min,
        maxRent: values.max,
      },
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [e.target.id]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post("/user/roommate-information", formData);
    } catch (error) {
      setError(error.response.data.message);
    }
    setLoading(false);
  };

  if (loading) return <LoadingComponent />;

  return (
    <form
      className="m-4 p-4 w-2/3 flex flex-col justify-end items-end rounded-lg shadow-lg"
      method="POST"
      onSubmit={handleSubmit}
    >
      <h1 className="w-full text-2xl font-bold">Roommate Preferences</h1>
      {error && (
        <p className="text-red-500 text-sm w-full text-center">{error}</p>
      )}
      <Select
        label="Gender"
        id="gender"
        options={[
          {
            label: "No Preference",
            value: "no preference",
          },
          {
            label: "Male",
            value: "male",
          },
          {
            label: "Female",
            value: "female",
          },
        ]}
        value={formData.preferences.gender}
        onChange={handleChange}
      />
      <Select
        label="Lifestyle"
        id="lifestyle"
        options={[
          {
            label: "No Preference",
            value: "no preference",
          },
          {
            label: "Quiet",
            value: "quiet",
          },
          {
            label: "Social",
            value: "social",
          },
        ]}
        value={formData.preferences.lifestyle}
        onChange={handleChange}
      />
      <Select
        label="Cleanliness"
        id="cleanliness"
        options={[
          {
            label: "No Preference",
            value: "no preference",
          },
          {
            label: "Very Clean",
            value: "very clean",
          },
          {
            label: "Moderately Clean",
            value: "moderately clean",
          },
        ]}
        value={formData.preferences.cleanliness}
        onChange={handleChange}
      />
      <RangeSlider
        id="budget"
        label="Budget"
        min={1}
        max={200000}
        onChange={handleRangeChange}
      />
      <div className="w-full flex flex-row gap-4 justify-end items-end">
        <div className="w-full flex flex-row gap-4 justify-end items-end">
          <IconButton type="submit" label="Save" className="w-[200px]">
            <FaSave />
          </IconButton>
        </div>
      </div>
    </form>
  );
};

export default RoommateProfile;
