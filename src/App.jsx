import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Router> {/* Wrap the whole app in Router */}
      <Routes> {/* Define routes here */}
        <Route path="/" element={<Signup></Signup>} /> {/* Default page (Sign Up) */}
        <Route path="/dashboard" element={<Dashboard></Dashboard>} /> {/* Dashboard */}
        {/* <Route path='/ForgotPassword' Component={ForgotPassword} /> */}
      </Routes>
    </Router>
    </>
  );
}

export default App;
