import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";

// Disable mouse wheel value change on all number input fields globally
document.addEventListener("wheel", function (e) {
  if (document.activeElement && document.activeElement.type === "number") {
    e.preventDefault();
  }
}, { passive: false });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);