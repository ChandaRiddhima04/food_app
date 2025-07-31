

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // ✅ Correct path with case and extension
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
