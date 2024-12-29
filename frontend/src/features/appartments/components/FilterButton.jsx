import { FaFilter } from "react-icons/fa";

const FilterButton = ({
  label = "FILTER",
  onClick,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`px-2 md:px-4 bg-primary text-white md:text-md text-sm h-10 py-2 my-4 rounded-lg flex items-center gap-2 ${className}`}
      onClick={onClick}
      {...props}
    >
      <FaFilter className="md:w-5 md:h-5 w-2 h-2" />
      <span>{label}</span>
    </button>
  );
};

export default FilterButton;
