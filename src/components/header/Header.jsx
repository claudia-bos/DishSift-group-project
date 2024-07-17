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
      <nav className="flex space-x-4 items-center">
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
                <UserCircleIcon className="h-6 w-6 mr-1" />
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
