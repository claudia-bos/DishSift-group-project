import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Cog6ToothIcon,
  UserIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const ProfilePage = () => {
  const userId = useSelector((state) => state.userId);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/session-check");
        console.log(res.data);
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    console.log("user:", user);

    const fetchFavorites = async () => {
      try {
        const res = await axios.get("/api/getFavorites");
        setFavorites(res.data.favorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchUser();
    fetchFavorites();
  }, []);
  console.log("favorites:", favorites);

  const handleUpdateAccount = async () => {
    try {
      await axios.put("/api/profile", {
        username: newUsername,
        password: newPassword,
      });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete("/api/profile", {
        data: { password: deletePassword },
      });
      if (res.data.success) {
        alert("Account deleted successfully");
        dispatch({ type: "LOGOUT" });
        navigate("/home-page");
      } else {
        alert("Invalid password. Account not deleted.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Invalid password. Account not deleted.");
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await axios.delete(`/api/favorites/${favoriteId}`);
      setFavorites(favorites.filter((fav) => fav.favoriteId !== favoriteId));
    } catch (error) {
      console.error("Error removing favorites:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex pt-24 justify-center items-start min-h-screen bg-gray-200 p-8 ">
      <div className="w-1/3 pr-4">
        <div className="flex items-center mb-4  text-primary-1000">
          <UserIcon className="h-6 w-6 mr-1" />
          <h1 className="text-2xl text-primary-1000 font-bold font-serif">
            {user.username}'s Profile
          </h1>
        </div>

        <div
          className="flex items-center cursor-pointer text-primary-1000"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Cog6ToothIcon className="h-6 w-6 mr-1 mb-6 " />
          <span className="font-serif text-xl text-zinc-500 hover:underline mb-6">
            Settings
          </span>
        </div>
        {showSettings && (
          <div className="mb-8">
            <h2 className="text-lg text-primary-1000 mb-2">Update Account</h2>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="block w-72  mb-2 p-2 border border-other-gray rounded-md focus:outline-none"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-72  mb-2 p-2 border border-other-gray rounded-md focus:outline-none"
            />
            <button
              onClick={handleUpdateAccount}
              className="bg-primary-700 text-white px-4 py-2 rounded-md mb-6 hover:bg-other-hover"
            >
              Update
            </button>

            <h2 className="text-lg text-primary-1000 mb-2">Delete Account</h2>
            <input
              type="password"
              placeholder="Confirm Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="block w-72 mb-2 p-2 border border-other-gray rounded-md focus:outline-none"
            />
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-primary-700 text-white px-4 py-2 rounded-md mb-5 hover:bg-other-hover"
            >
              Delete
            </button>
            {showDeleteConfirm && (
              <div className="mt-4">
                <p className="mb-4 text-base text-zinc-500 font-serif ">
                  {user.username}, are you sure you want to delete your account?
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="text-zinc-500 px-4 py-2 hover:underline font-serif "
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-zinc-500 px-4 py-2 hover:underline font-serif "
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-2/3 pl-4">
        <h2 className="text-2xl text-primary-1000 font-bold font-serif mb-8">
          Favorite Recipes
        </h2>
        <div>
          {favorites.map((fav) => (
            <div
              key={fav.favoriteId}
              className="flex items-center justify-between mb-2"
            >
              <button
                onClick={() => handleRemoveFavorite(fav.favoriteId)}
                className="mr-4 text-secondary-1000 hover:text-secondary-1000"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              <Link
                to={`/recipe-page/${fav.recipeId}`}
                state={{ recipe: fav.Recipe }}
                className="text-secondary-1000 hover:underline flex-grow"
              >
                {fav.recipe.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
