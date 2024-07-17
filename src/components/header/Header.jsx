import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Login from "../login/Login.jsx";
import LogoutButton from "../logoutbutton/LogoutButton.jsx";

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
    <header className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-primary-700 via-primary-900 to-primary-700 drop-shadow-lg shadow-lg fixed top-0 z-10">
      <div className="flex-grow">
        <Link to="/">
          <h1 className="text-3xl font-medium text-center text-primary-0 drop-shadow-md">
            Dish Sift
          </h1>
        </Link>
      </div>
      <nav className="flex space-x-4 items-center font-medium text-primary-0 drop-shadow-md">
        <div className="relative">
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

        <div className="flex space-x-4">
          {userId ? (
            <>
              <Link className="ml-4" to="/profile-page">
                Profile
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <span className="cursor-pointer" onClick={handleLoginClick}>
                Log in
              </span>
              <br />
              <Link to="/register">Sign Up</Link>
              {showLogin && <Login closePopup={closePopup} />}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
