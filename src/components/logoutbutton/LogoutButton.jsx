import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/logout");
      if (res.data.success) {
        dispatch({ type: "LOGOUT" });
        console.log("Logout successful");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default LogoutButton;
