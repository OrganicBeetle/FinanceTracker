import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { Navigate } from 'react-router-dom';
import ForgotPassword from './components/ForgotPassword';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const isAuthenticated = () => {
  return localStorage.getItem("user") !== null; // Assumes user info is stored in localStorage
};
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};



const App = () => {
  return (
    <>
    <ToastContainer/>
    <Router> {/* Wrap the whole app in Router */}
      <Routes> {/* Define routes here */}
      <Route path="/" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/ForgotPassword' Component={ForgotPassword} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
