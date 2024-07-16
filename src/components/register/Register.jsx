// delete later
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userId = useSelector((state) => state.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check that username exists and is at least 4 characters
    if (username && username.length >= 4) {
      // check if forms are not empty (or that username, password, and confirmPassword aren't empty strings)
      // if forms are filled out check if username is available (not being used already)
      // if username is available, make sure the password and confirm password match
      // if password and confirmPassword match, create new user in database and navigate to login page
      if (password === confirmPassword) {
        const bodyObj = {
          username: username,
          password: password,
        };

        const res = await axios.post("/api/register", bodyObj);

        if (res.data.success) {
          console.log(`Dispatching userId ${res.data.userId} to redux store`);
          dispatch({
            type: "USER_AUTH",
            payload: res.data.userId,
          });
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          // Redirect to profile page
          navigate("/");
        } else {
          alert(res.data.message);
        }
      } else {
        alert("Passwords do not match");
      }
    } else {
      alert("Username must be at least 4 characters long");
    }
  };

  return (
    <div className=" justify-center items-center min-h-screen flex bg-secondary-200">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center animate-pulse">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-black mb-1"
            >
              Username:
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="username"
              name="username"
              id="username"
              placeholder="Jhon11"
              required
              className="block w-full px-3 py-2 border border-other-gray rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Password:
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              id="password"
              placeholder="*******"
              required
              className="block w-full px-3 py-2 border border-other-gray rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-black mb-1"
            >
              Confirm Password:
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              className="block w-full px-3 py-2 border border-other-gray rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-other-buttons px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-other-hover"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
