import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar glass-card">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="logo-icon">🌍</span>
          <span className="logo-text">BhoomiChain</span>
        </div>
        
        <ul className="nav-links">
          <li><NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink></li>
          <li><NavLink to="/registry" className={({isActive}) => isActive ? "active" : ""}>Land Registry</NavLink></li>
          <li><NavLink to="/explorer" className={({isActive}) => isActive ? "active" : ""}>Block Explorer</NavLink></li>
          <li><NavLink to="/transactions" className={({isActive}) => isActive ? "active" : ""}>Transactions</NavLink></li>
        </ul>

        <div className="navbar-user">
          <span className="user-email">{user?.email}</span>
          <button className="btn-outline" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
