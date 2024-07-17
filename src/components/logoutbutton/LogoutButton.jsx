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
    <div className="font-medium text-primary-0 drop-shadow-md">
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default LogoutButton;
