import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import Header from "./components/header/Header.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./index.css";

function App() {
  const userId = useSelector((state) => state.userId);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const sessionCheck = async () => {
    const res = await axios.get("/api/session-check");

    if (res.data.success) {
      console.log("sessionCheck: SUCCESS");
      dispatch({
        type: "USER_AUTH",
        payload: res.data.userId,
      });
    } else {
      console.log("sessionCheck: FAILURE");
      dispatch({ type: "LOGOUT" });
      navigate("/");
    }
  };

  useEffect(() => {
    sessionCheck();
  }, []);

  return (
    <div className="text-primary-1000 antialiased selection:bg-secondary-300 selection:text-secondary-900">
      <Header />
      <Outlet />
      {/* <RecipePage /> */}
    </div>
  );
}

export default App;
