import React from "react";
import { useUser } from "./UserContext";
import Login from "./Login";
import "./styles/Profile.css";

const Profile = () => {
  const { user, login, logout } = useUser();

  return (
    <div className="profile-page">
      {user ? (
        <div className="profile-welcome">
          <p>
            Welcome, <span className="username">{user.username}</span>!
          </p>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="profile-login">
          <Login onLogin={login} />
        </div>
      )}
    </div>
  );
};

export default Profile;