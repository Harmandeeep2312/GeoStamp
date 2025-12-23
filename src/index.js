import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LandingPage from "./LandingPage/Pages/LandingPage";
import SignUp from "./LandingPage/Pages/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./LandingPage/Pages/AdminDashBoard";
import AttendancePage from "./LandingPage/Pages/AttendancePage";
import ProtectedRoute from "./LandingPage/Components/ProtectedRoute";
import AttendanceProtectedRoute from "./LandingPage/Components/AttendanceProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<SignUp />} />

      <Route element={<AttendanceProtectedRoute />}>
        <Route
          path="/attendance/:eventId"
          element={<AttendancePage />}
        />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
