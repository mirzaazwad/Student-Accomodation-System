import { FaSearch } from "react-icons/fa";

const SearchBar = (props) => {
  return (
    <div className="w-full m-4 p-4 lg:m-2 lg:p-2 flex flex-row">
      <FaSearch className="text-white font-semibold w-10 h-10 p-2 bg-primary rounded-l-lg" />
      <input
        id={props.id}
        name={props.id}
        type={props.type}
        placeholder={props.placeholder}
        className="bg-gray-100 border-2 border-gray-300 rounded-r-lg w-full h-10 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-primary"
        onChange={props.onChange}
        value={props.value}
        disabled={props.disabled}
      />
    </div>
  );
};

export default SearchBar;
