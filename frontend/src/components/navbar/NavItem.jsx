import { useLocation, useNavigate } from "react-router-dom";

const NavItem = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  

  return (
    <div
      className={`w-full lg:w-fit  mx-4 my-2 cursor-pointer text-white p-2 rounded-lg hover:bg-primary-dark px-4 py-2 ${
        pathname.includes(props.path)
          ? "bg-primary-dark cursor-not-allowed"
          : "bg-primary"
      }`}
      onClick={() => {
        if (pathname !== props.path) {
          navigate(props.path);
          if (props.callback) {
            props.callback();
          }
        }
      }}
    >
      {props.text}
    </div>
  );
};

export default NavItem;
