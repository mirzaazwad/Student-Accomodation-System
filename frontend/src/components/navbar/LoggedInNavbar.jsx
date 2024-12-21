import { useState } from "react";
import NavItem from "./NavItem";
import { FaBars } from "react-icons/fa";

const LoggedInNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full max-w-full bg-primary p-3 lg:max-h-full w-full top-0 shadow-md lg:shadow-none">
      <div className="lg:w-full hidden  lg:flex flex-row justify-end gap-2  max-h-[70px]">
        <NavItem path="/dashboard" text="Dashboard" />
        <NavItem path="/appartments" text="Appartments" />
        <NavItem path="/profile" text="Profile" />
        <NavItem path="/roommates" text="Roommates" />
        <NavItem path="/settings" text="Settings" />
        <NavItem path="/logout" text="Logout" />
      </div>
      <div className="lg:w-full lg:hidden  flex flex-col justify-end">
        <div
          className="bg-primary w-fit h-fit mx-4 my-2 cursor-pointer text-white rounded-lg hover:bg-primary-dark px-4 py-2"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <FaBars />
        </div>
        {isOpen && (
          <div className="w-full flex flex-col justify-center items-center gap-2 bg-primary px-4 py-2">
            <NavItem
              path="/dashboard"
              text="Dashboard"
              callback={() => {
                setIsOpen(!isOpen);
              }}
            />
            <NavItem
              path="/appartments"
              text="Appartments"
              callback={() => {
                setIsOpen(!isOpen);
              }}
            />
            <NavItem
              path="/profile"
              text="Profile"
              callback={() => {
                setIsOpen(!isOpen);
              }}
            />
            <NavItem
              path="/roommates"
              text="Roommates"
              callback={() => {
                setIsOpen(!isOpen);
              }}
            />
            <NavItem
              path="/settings"
              text="Settings"
              callback={() => {
                setIsOpen(!isOpen);
              }}
            />
            <NavItem
              path="/logout"
              text="Logout"
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

export default LoggedInNavbar;
