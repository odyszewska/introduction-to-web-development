import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const storedUser = JSON.parse(localStorage.getItem("user"));
  
    if (!storedUser || storedUser.username !== username || storedUser.password !== password) {
      alert("Nieprawidłowy login lub hasło!");
      return;
    }
  
    onLogin(username);
    navigate("/profile");
  };
  

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
          <button
            className="register-button"
            type="button"
            onClick={() => navigate("/register")}
          >
            Register Here
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;