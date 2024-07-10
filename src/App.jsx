import React from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "./components/header/Header.jsx";
// import RecipePage from "./pages/RecipePage.jsx";
// import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      {/* <RecipePage /> */}
    </>
  );
}

export default App;
