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
    <header>
      <div>
        <Link to="/">
          <h1>DishSift</h1>
        </Link>
      </div>
      <nav>
        <div>
          <span onClick={handleDropdownToggle}>Recipes</span>
          {dropdownVisible && (
            <div>
              <Link to="/search-page">All Recipes</Link>
              <br />
              <Link to="/pantry-page">Pantry Recipes</Link>
            </div>
          )}
        </div>

        <div>
          {userId ? (
            <>
              <Link to="/profile-page">Profile</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <span onClick={handleLoginClick}>Log in</span>
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
