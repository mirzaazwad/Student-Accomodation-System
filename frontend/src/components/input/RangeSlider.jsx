import { useCallback, useEffect, useState, useRef } from "react";
import { colors } from "../../utils/colors";

const RangeSlider = ({
  min,
  max,
  label,
  trackColor = "#cecece",
  onChange,
  rangeColor = colors.primary.DEFAULT,
  width = "300px",
  currencyText = "BDT",
}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    if (minVal != minValRef.current || maxVal != maxValRef.current) {
      onChange({ min: minVal, max: maxVal });
      minValRef.current = minVal;
      maxValRef.current = maxVal;
    }
  }, [minVal, maxVal, onChange]);

  return (
    <div className="w-full flex items-center justify-center flex-col space-y-6 m-4 p-4">
      <div className="w-full">
        <label htmlFor="price" className="text-gray-700 font-semibold">
          {label}
        </label>
      </div>
      <div className="multi-slide-input-container flex" style={{ width }}>
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
          }}
          className="thumb thumb-left"
          style={{
            width,
            zIndex: minVal > max - 100 || minVal === maxVal ? 5 : undefined,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
          }}
          className="thumb thumb-right"
          style={{
            width,
            zIndex: minVal > max - 100 || minVal === maxVal ? 4 : undefined,
          }}
        />

        <div className="slider">
          <div
            style={{ backgroundColor: trackColor }}
            className="track-slider"
          />

          <div
            ref={range}
            style={{ backgroundColor: rangeColor }}
            className="range-slider"
          />
        </div>
      </div>
      <div className="w-[350px] px-4 flex items-center justify-between gap-x-5">
        <p className="text-sm text-gray-600 font-semibold">
          {currencyText} {minVal}
        </p>
        <p className="text-sm text-gray-600 font-semibold">
          {currencyText} {maxVal}
        </p>
      </div>
    </div>
  );
};

export default RangeSlider;
