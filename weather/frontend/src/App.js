import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Map from './pages/Map';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import { isAuthenticated, isAdmin } from './utils/auth';
import './App.css';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<Map />} />
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
