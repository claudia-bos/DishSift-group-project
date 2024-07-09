// delete later
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

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
    <div>
      <div>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="username"
            id="username"
            name="username"
            placeholder="Jhon11"
            required
          />

          <label>Password:</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            placeholder="********"
            required
          />

          <button type="submit">Login</button>
        </form>
        <button onClick={closePopup}>Close</button>
      </div>
    </div>
  );
};

export default Login;
