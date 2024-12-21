const Select = (props) => {
  return (
    <div className="w-full m-4 p-4 flex flex-col">
      <label htmlFor={props.id} className="text-gray-700 font-semibold">
        {props.label}
      </label>
      <select
        id={props.id}
        className="bg-gray-100 border-2 border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-primary"
        onChange={props.onChange}
        value={props.value}
      >
        {props.options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
