import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AutoCheck from "./components/AutoCheck.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      {/* <AutoCheck /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          }
        />
        {/* <Route path="/" element={<App />} /> */}
      </Routes>
    </BrowserRouter>
  </>,
);
