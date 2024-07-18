import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Login from "../login/Login.jsx";
import LogoutButton from "../logoutbutton/LogoutButton.jsx";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import logo from "../../assets/logos/Dish_Sift_Logo_White.png";

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
    <header className="w-full h-[68px] px-12 flex items-center justify-between py-4 bg-gradient-to-r from-primary-700 via-primary-900 to-primary-700 drop-shadow-lg shadow-lg fixed top-0 z-20">
      <div className="w-full flex justify-end">
        <div className="absolute flex left-16 md:left-0 md:justify-center w-full top-[15px]">
          <img src={logo} alt="logo" className="h-9 pt-1 mr-2" />
          <Link to="/" className="">
            <h1
              className="text-3xl font-medium text-center text-primary-0 drop-shadow-md 
                hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary-50 before:absolute before:left-0 before:bottom-0"
            >
              Dish Sift
            </h1>
          </Link>
        </div>
        <nav className="flex items-center">
          <div className="group relative mx-4 font-medium text-primary-0 drop-shadow-md">
            <div
              onFocus={handleDropdownToggle}
              className="cursor-pointer
              hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary-50 before:absolute before:left-0 before:bottom-0"
            >
              Recipes
            </div>
            {/* {dropdownVisible && ( */}
            <div className="fixed top-full -left-3 hidden rounded-b-lg text-nowrap px-2 py-4 group-hover:block group-focus:block hover:block bg-gradient-to-br from-primary-800 to-primary-600">
              <Link className="block px-1 pb-2" to="/search-page">
                <div className="w-fit hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary-50 before:absolute before:left-0 before:bottom-0">
                  All Recipes
                </div>
              </Link>
              {userId && (
                <>
                  <Link className="block px-1 pt-2" to="/pantry-page">
                    <div className="w-fit hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary-50 before:absolute before:left-0 before:bottom-0">
                      Pantry Recipes
                    </div>
                  </Link>
                </>
              )}
            </div>
            {/* )} */}
          </div>

          <div className="flex">
            {userId ? (
              <>
                <Link
                  className="mx-4 font-medium text-primary-0 drop-shadow-md hover:text-primary-100"
                  to="/profile-page"
                >
                  <UserCircleIcon className="h-6 w-6 mr-1" />
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <span
                  className="cursor-pointer mx-4 font-medium text-primary-0 drop-shadow-md  
                  hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary-50 before:absolute before:left-0 before:bottom-0"
                  onClick={handleLoginClick}
                >
                  Log in
                </span>
                <br />
                <Link
                  to="/register"
                  className="mx-4 font-medium text-primary-0 drop-shadow-md
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
