import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./components/UserContext"; // Import UserProvider
import { BasketProvider } from "./components/BasketContext"; // Import BasketProvider

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <BasketProvider>
        <Router>
          <App />
        </Router>
      </BasketProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
