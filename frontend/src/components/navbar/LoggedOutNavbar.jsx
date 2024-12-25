import { useState } from "react";
import NavItem from "./NavItem";
import { FaBars } from "react-icons/fa";

const LoggedOutNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full max-w-full bg-primary p-3 lg:max-h-full w-full top-0 shadow-md lg:shadow-none mb-4">
      <div className="lg:w-full hidden  lg:flex flex-row justify-end gap-2  max-h-[70px]">
        <NavItem path="/" text="Home" />
        <NavItem path="/login" text="Login" />
        <NavItem path="/register" text="Registration" />
      </div>
      <div
        className="lg:hidden fixed top-0 left-0 w-full bg-primary shadow-md"
        style={{ zIndex: 1000 }}
      >
        <div
          className="bg-primary w-fit h-fit m-4 cursor-pointer text-white rounded-lg hover:bg-primary-dark px-4 py-2 flex items-center"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <FaBars />
        </div>
        {isOpen && (
          <div className="w-full flex flex-col items-center gap-2 bg-primary px-4 py-4">
            <NavItem
              path="/"
              text="Home"
              callback={() => {
                setIsOpen(!isOpen);
              }}
            />
            <NavItem
              path="/login"
              text="Login"
              callback={() => {
                setIsOpen(!isOpen);
              }}
            />
            <NavItem
              path="/register"
              text="Registration"
              callback={() => {
                setIsOpen(!isOpen);
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default LoggedOutNavbar;
