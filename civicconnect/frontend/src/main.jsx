import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/style.css";// Updated path pointing to the styles folder

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);