import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import './Navbar.css';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <NavLink to="/" className="navbar-logo">
            <Activity className="logo-icon" />
            <span>MediPredict</span>
          </NavLink>
        </div>

        <div className="navbar-desktop-menu">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/diseases" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Eye Disease Info</NavLink>
          <NavLink to="/detect" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>AI Detection</NavLink>
          <NavLink to="/assistant" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>AI Assistant</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Profile</NavLink>
        </div>

        <div className="navbar-mobile-toggle">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X className="toggle-icon" /> : <Menu className="toggle-icon" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="navbar-mobile-menu">
          <NavLink to="/" end className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>Home</NavLink>
          <NavLink to="/diseases" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>Eye Disease Info</NavLink>
          <NavLink to="/detect" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>AI Detection</NavLink>
          <NavLink to="/assistant" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>AI Assistant</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={toggleMenu}>Profile</NavLink>
        </div>
      )}
    </nav>
  );
}
