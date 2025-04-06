import React from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css"; // Import the CSS file for the navbar

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <h2 style={{ color: "white" }}>MyStore</h2> {/* Example store logo */}
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/basket">Basket</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
