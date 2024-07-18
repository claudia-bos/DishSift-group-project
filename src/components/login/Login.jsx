import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Login = ({ closePopup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userId = useSelector((state) => state.userId);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Logging in...");

    const bodyObj = {
      username: username,
      password: password,
    };

    try {
      const res = await axios.post("/api/login", bodyObj);
      console.log(res.data.message);

      if (res.data.user.userId) {
        console.log(
          `Dispatching userId ${res.data.user.userId} to redux store`
        );
        dispatch({
          type: "USER_AUTH",
          payload: res.data.user.userId,
        });

        setUsername("");
        setPassword("");
      }

      closePopup();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed h-screen inset-0 z-50 bg-gray-200 backdrop-blur-sm flex justify-center items-center bg-opacity-50">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center animate-pulse text-other-buttons">
          Log In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-primary-900 mb-1"
            >
              Username:
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="username"
              id="username"
              name="username"
              placeholder="Jhon11"
              required
              className="block w-full px-3 py-2 border border-other-gray rounded-md shadow-sm sm:text-sm cursor-text focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary-900 mb-1"
            >
              Password:
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="********"
              required
              className="block w-full px-3 py-2 border border-other-gray rounded-md shadow-sm sm:text-sm cursor-text focus:outline-none"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-other-buttons px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-other-hover"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
