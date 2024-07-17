import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/logout");
      if (res.data.success) {
        dispatch({ type: "LOGOUT" });
        console.log("Logout successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className="mx-4 font-medium text-primary-0 drop-shadow-md
        hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-0.5 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary-50 before:absolute before:left-0 before:bottom-0"
    >
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default LogoutButton;
