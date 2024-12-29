const TextArea = (props) => {
  return (
    <div className="w-full m-4 p-4 lg:m-2 lg:p-2 flex flex-col">
      <label htmlFor={props.id} className="text-gray-700 font-semibold">
        {props.label}
      </label>
      <textarea
        id={props.id}
        name={props.id}
        type={props.type}
        placeholder={props.placeholder}
        className="bg-gray-100 border-2 border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-primary"
        onChange={props.onChange}
        value={props.value}
        disabled={props.disabled}
      />
    </div>
  );
};

export default TextArea;
