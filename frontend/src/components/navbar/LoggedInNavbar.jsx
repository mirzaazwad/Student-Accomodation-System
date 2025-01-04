import { useState } from "react";
import NavItem from "./NavItem";
import { FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";

const LoggedInNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className="w-full max-w-full bg-primary p-3 lg:max-h-full w-full top-0 shadow-md lg:shadow-none">
      <div className="lg:w-full hidden  lg:flex flex-row justify-end gap-2  max-h-[70px]">
        <NavItem path="/dashboard" text="Dashboard" />
        {user.userType === "student" && (
          <>
            <NavItem path="/appartments" text="Appartments" />
            <NavItem path="/roommates" text="Roommates" />
          </>
        )}
        {user.userType === "landlord" && (
          <NavItem path="/listing" text="Listing" />
        )}
        <NavItem path="/profile" text="Profile" />
        <NavItem path="/chat" text="Chat" />
        <NavItem path="/transactions" text="Transactions" />
        <NavItem path="/logout" text="Logout" />
      </div>
      <div
        className="lg:hidden fixed top-0 left-0 w-full bg-primary shadow-md"
        style={{ zIndex: 1000 }}
      >
        <div
          className="bg-primary w-fit h-fit m-4 cursor-pointer text-white rounded-lg hover:bg-primary-dark px-4 py-2 flex items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <FaBars />
        </div>
        {isOpen && (
          <div className="w-full flex flex-col items-center gap-2 bg-primary px-4 py-4">
            <NavItem
              path="/dashboard"
              text="Dashboard"
              callback={() => setIsOpen(false)}
            />
            {user.userType === "student" && (
              <>
                <NavItem
                  path="/appartments"
                  text="Appartments"
                  callback={() => setIsOpen(false)}
                />
                <NavItem
                  path="/roommates"
                  text="Roommates"
                  callback={() => setIsOpen(false)}
                />
              </>
            )}
            {user.userType === "landlord" && (
              <NavItem
                path="/listing"
                text="Listing"
                callback={() => setIsOpen(false)}
              />
            )}
            <NavItem
              path="/profile"
              text="Profile"
              callback={() => setIsOpen(false)}
            />
            <NavItem
              path="/chat"
              text="Chat"
              callback={() => setIsOpen(false)}
            />
            <NavItem
              path="/transactions"
              text="Transactions"
              callback={() => setIsOpen(false)}
            />
            <NavItem
              path="/logout"
              text="Logout"
              callback={() => setIsOpen(false)}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default LoggedInNavbar;
