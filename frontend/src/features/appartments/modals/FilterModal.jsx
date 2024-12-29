import { useEffect, useState } from "react";
import MapSearch from "../../../components/Map";
import PopupModal from "../../../components/PopupModal";
import RangeSlider from "../../../components/input/RangeSlider";
import Select from "../../../components/input/Select";
import PrimaryButton from "../../../components/input/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { filterActions } from "../context/filter-slice";
import { closeModal } from "../../../utils/ModalHelper";

const FilterModal = () => {
  const dispatch = useDispatch();
  const [onAddressSelect, setOnAddressSelect] = useState({
    position: [23.801417, 90.404926],
    address: "Banani, Dhaka",
  });
  const filterValues = useSelector((state) => state.filter);
  const handleRangeChange = (values) => {
    dispatch(filterActions.setMinPrice(values.min));
    dispatch(filterActions.setMaxPrice(values.max));
  };

  const handleAddressChange = (address) => {
    setOnAddressSelect(address);
    dispatch(filterActions.setLocation(address));
  };

  useEffect(() => {
    if (filterValues.set) {
      if (filterValues.location) {
        setOnAddressSelect(filterValues.location);
      }
      if (filterValues.minPrice && filterValues.maxPrice) {
        handleRangeChange({
          min: filterValues.minPrice,
          max: filterValues.maxPrice,
        });
      }
    }
  }, []);

  return (
    <PopupModal
      title={"Filter"}
      closeCB={() => dispatch(filterActions.clear())}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Select
          id="roomType"
          label="Room Type"
          onChange={(e) => dispatch(filterActions.setRoomType(e.target.value))}
          options={[
            {
              label: "Any",
              value: undefined,
            },
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
          min={1}
          max={200000}
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
            onAddressSelect={handleAddressChange}
            zoom={10}
          />
        </div>
      </div>
      <PrimaryButton
        className="w-full"
        onClick={() => {
          dispatch(filterActions.setFilter());
          closeModal();
        }}
      >
        Apply Filter
      </PrimaryButton>
    </PopupModal>
  );
};

export default FilterModal;
