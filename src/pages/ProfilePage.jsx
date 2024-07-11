import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

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
    <div>
      <h1>{user.username}'s Profile</h1>

      <div>
        <button onClick={() => setShowSettings(!showSettings)}>Settings</button>
        {showSettings && (
          <div>
            <h2>Update Account</h2>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleUpdateAccount}>Update</button>

            <h2>Delete Account</h2>
            <input
              type="password"
              placeholder="Confirm Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <button onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </button>
            {showDeleteConfirm && (
              <div>
                <p>
                  {user.username}, are you sure you want to delete your account?
                </p>
                <button onClick={handleDeleteAccount}>Yes, Delete</button>
                <button onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h2>Favorite Recipes</h2>
        <div>
          {favorites.map((fav) => (
            <div key={fav.favoriteId}>
              <Link
                to={`/recipe-page/${fav.recipeId}`}
                state={{ recipe: fav.Recipe }}
              >
                {fav.recipe.label}
              </Link>
              <br />
              <button onClick={() => handleRemoveFavorite(fav.favoriteId)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
