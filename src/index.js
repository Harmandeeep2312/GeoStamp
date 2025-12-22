import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LandiingPage from './LandingPage/Pages/LandingPage';
import ErrorBoundary from './ErrorBoundary';
import SignUp from './LandingPage/Pages/SignUp'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import AdminDashboard from './LandingPage/Pages/AdminDashBoard';
import AttendancePage from './LandingPage/Pages/AttendancePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ErrorBoundary>
      <Routes>
        <Route path='/' element={<LandiingPage />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/admin' element={<AdminDashboard />}></Route>
        <Route path="/attendance/:eventId" element={<AttendancePage />}></Route>
      </Routes>
    </ErrorBoundary>
  </BrowserRouter>
);

