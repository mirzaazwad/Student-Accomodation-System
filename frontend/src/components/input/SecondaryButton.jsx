import { Spinner } from "react-bootstrap";

const SecondaryButton = (props) => {
  return (
    <div className="w-full m-4 p-4 lg:m-2 lg:p-2 flex flex-col justify-center items-center">
      <button
        type={props.type}
        className="bg-primary lg:w-1/2 w-full text-center font-bold hover:bg-primary-dark text-white font-medium px-4 py-2 flex rounded-xl"
        onClick={props.onClick}
        disabled={props.disabled}
      >
        <Spinner variant="primary" />
        {props.children}
      </button>
    </div>
  );
};

export default SecondaryButton;
