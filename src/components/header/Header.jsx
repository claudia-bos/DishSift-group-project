import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Login from "../login/Login.jsx";
import LogoutButton from "../logoutbutton/LogoutButton.jsx";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const userId = useSelector((state) => state.userId);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const closePopup = () => {
    setShowLogin(false);
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="w-full h-[68px] flex items-center justify-between py-4 px-6 bg-gradient-to-r from-primary-700 via-primary-900 to-primary-700 drop-shadow-lg shadow-lg fixed top-0 z-20">
      <div className="w-full flex justify-end">
        <div className="absolute flex justify-center w-full left-0 top-[15px]">
          <Link to="/" className="">
            <h1 className="text-3xl font-medium text-center text-primary-0 drop-shadow-md">
              Dish Sift
            </h1>
          </Link>
        </div>
        <nav className="flex items-center">
          <div className="relative mx-2 font-medium text-primary-0 drop-shadow-md">
            <div
              onClick={handleDropdownToggle}
              className="cursor-pointer
              hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary-50 before:absolute before:left-0 before:bottom-0"
            >
              Recipes
            </div>
            {dropdownVisible && (
              <div className="absolute top-full mt-2 rounded">
                <Link className="block px-1 py-2" to="/search-page">
                  All Recipes
                </Link>
                <br />
                {userId && (
                  <>
                    <Link className="block px-1 py-2" to="/pantry-page">
                      Pantry Recipes
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex">
            {userId ? (
              <>
                <Link
                  className="mx-2 font-medium text-primary-0 drop-shadow-md hover:text-primary-100"
                  to="/profile-page"
                >
                  <UserCircleIcon className="h-6 w-6 mr-1" />
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <span
                  className="cursor-pointer mx-2 font-medium text-primary-0 drop-shadow-md  
                  hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary-50 before:absolute before:left-0 before:bottom-0"
                  onClick={handleLoginClick}
                >
                  Log in
                </span>
                <br />
                <Link
                  to="/register"
                  className="mx-2 font-medium text-primary-0 drop-shadow-md
                  hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary-50 before:absolute before:left-0 before:bottom-0"
                >
                  Sign Up
                </Link>
                {showLogin && <Login closePopup={closePopup} />}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
