import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiMap, FiBarChart2, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import { getUser, logout, isAdmin } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const admin = isAdmin();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌦️</span>
          <span className="logo-text">Weather Alert</span>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-item">
            <FiHome /> Trang chủ
          </Link>
          <Link to="/map" className="navbar-item">
            <FiMap /> Bản đồ
          </Link>
          {admin && (
            <Link to="/dashboard" className="navbar-item">
              <FiBarChart2 /> Thống kê
            </Link>
          )}
          {user && (
            <Link to="/reports" className="navbar-item">
              <FiUser /> Báo cáo của tôi
            </Link>
          )}
          {admin && (
            <Link to="/admin" className="navbar-item admin">
              <FiShield /> Quản trị
            </Link>
          )}
          {user ? (
            <div className="navbar-user">
              <span className="user-name">{user.username}</span>
              <button onClick={handleLogout} className="btn-logout">
                <FiLogOut /> Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar-item">
              <FiUser /> Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;










