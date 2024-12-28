import { useState } from "react";
import MapSearch from "../../../components/Map";
import PopupModal from "../../../components/PopupModal";
import RangeSlider from "../../../components/input/RangeSlider";
import Select from "../../../components/input/Select";
import PrimaryButton from "../../../components/input/PrimaryButton";

const FilterModal = () => {
  const [onAddressSelect, setOnAddressSelect] = useState({
    position: [23.801417, 90.404926],
    address: "Banani, Dhaka",
  });
  const handleRangeChange = (values) => {
    console.log("Selected Range:", values);
  };
  return (
    <PopupModal title={"Filter"}>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Select
          id="roomType"
          label="Room Type"
          options={[
            {
              label: "Single",
              value: "Single",
            },
            {
              label: "Shared",
              value: "Shared",
            },
            {
              label: "Studio",
              value: "Studio",
            },
            {
              label: "Other",
              value: "Other",
            },
          ]}
        ></Select>
        <RangeSlider
          id="rent"
          label="Rent"
          min={0}
          max={200000}
          initialMin={5000}
          initialMax={25000}
          onChange={handleRangeChange}
        />
        <div className="w-full m-4 p-4">
          <label htmlFor="address" className="text-gray-700 font-semibold my-2">
            Location
          </label>
          <MapSearch
            movePointer
            showSearchBar
            currentPosition={onAddressSelect.position}
            onAddressSelect={setOnAddressSelect}
            zoom={10}
          />
        </div>
      </div>
      <PrimaryButton className="w-full">Apply Filter</PrimaryButton>
    </PopupModal>
  );
};

export default FilterModal;
