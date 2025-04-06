import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Main from "./components/Main";
import Profile from "./components/Profile";
import Basket from "./components/Basket";
import ProductPage from "./components/ProductPage";
import Navbar from "./components/Navbar";
import Register from "./components/Register";

const App = () => {
  return (
    <div>
      <nav>
        <Navbar />
      </nav>

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
