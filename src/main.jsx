import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { LiveProvider } from "./context/LiveContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Vite sets BASE_URL to "/" in dev, and "/esgfrontend/" in prod if you set base in vite.config */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <UserProvider>
          <LiveProvider>
            <App />
          </LiveProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
