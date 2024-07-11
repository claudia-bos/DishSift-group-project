import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
// import './index.css'
import Register from "./components/register/Register.jsx";
import PantryPage from "./pages/PantryPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import RecipePage from "./pages/RecipePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
// import Login from "./components/login/Login.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} />
      <Route path="register" element={<Register />} />
      <Route path="pantry-page" element={<PantryPage />} />
      <Route path="search-page" element={<SearchPage />} />
      <Route path="recipe-page/:recipeId" element={<RecipePage />} />
      <Route path="profile-page" element={<ProfilePage />} />
      <Route path="home-page" element={<HomePage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
