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
    <header className="flex items-center justify-between p-4 bg-primary-50">
      <div className="flex-grow">
        <Link to="/">
          <h1 className="text-3xl font-bold text-center">DishSift</h1>
        </Link>
      </div>
      <nav className="flex items-center">
        <div className="relative mx-2">
          <span onClick={handleDropdownToggle} className="cursor-pointer">
            Recipes
          </span>
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
              <Link className="mx-2" to="/profile-page">
                <UserCircleIcon className="h-6 w-6 mr-1" />
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <span className="cursor-pointer mx-2" onClick={handleLoginClick}>
                Log in
              </span>
              <br />
              <Link to="/register" className="mx-2">
                Sign Up
              </Link>
              {showLogin && <Login closePopup={closePopup} />}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
