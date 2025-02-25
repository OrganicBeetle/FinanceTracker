import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Router> {/* Wrap the whole app in Router */}
      <Routes> {/* Define routes here */}
        <Route path="/" element={<Signup></Signup>} /> {/* Default page (Sign Up) */}
        <Route path="/dashboard" element={<Dashboard></Dashboard>} /> {/* Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
