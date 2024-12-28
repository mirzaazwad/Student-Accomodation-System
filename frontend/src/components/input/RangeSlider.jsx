import { useState } from "react";

const RangeSlider = ({
  id,
  label,
  min,
  max,
  step = 1,
  initialMin,
  initialMax,
  currency = "BDT",
  onChange,
}) => {
  const [minValue, setMinValue] = useState(initialMin || min);
  const [maxValue, setMaxValue] = useState(initialMax || max);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(value);
    if (onChange) onChange({ min: value, max: maxValue });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(value);
    if (onChange) onChange({ min: minValue, max: value });
  };

  return (
    <div className="w-full relative m-4 p-4">
      {/* Label */}
      <label htmlFor={id} className="text-gray-700 font-semibold mb-2 block">
        {label}
      </label>
      <div className="relative w-full">
        {/* Slider Track */}
        <div className="h-2 bg-gray-300 rounded-full relative">
          {/* Active Range */}
          <div
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{
              left: `${((minValue - min) / (max - min)) * 100}%`,
              right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
            }}
          />
        </div>
        {/* Range Inputs */}
        <input
          type="range"
          id={id + "_min"}
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-auto h-2"
          style={{ zIndex: minValue > maxValue - 10 ? 1 : 0 }}
        />
        <input
          id={id + "_max"}
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-auto h-2"
        />
      </div>
      {/* Value Labels */}
      <div className="flex justify-between mt-4">
        <span className="text-sm text-gray-600">
          {currency}{" "}
          {minValue.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
        </span>
        <span className="text-sm text-gray-600">
          {currency}{" "}
          {maxValue.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
        </span>
      </div>
    </div>
  );
};

export default RangeSlider;
