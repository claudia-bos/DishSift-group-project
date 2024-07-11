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
    <div>
      <div>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="username"
            name="username"
            id="username"
            placeholder="Jhon11"
            required
          />

          <label>Password:</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            placeholder="*******"
            required
          />

          <label>Confirm Password:</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
          />

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
