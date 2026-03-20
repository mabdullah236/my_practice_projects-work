import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <nav>
      <div className="logo">My Translation</div>

      {/* MOBILE MENU BUTTON */}
      <div className="mobile-menu-btn" onClick={toggleMobileMenu}>
        &#9776;
      </div>

      {/* NAV LINKS */}
      <ul className={`nav-links ${mobileOpen ? "show" : ""}`}>
        <li><a href="/" className={window.location.pathname === "/" ? "active" : ""}>Home</a></li>
        <li><a href="/aboutus" className={window.location.pathname === "/aboutus" ? "active" : ""}>About Us</a></li>
        <li><a href="/ourmodels" className={window.location.pathname === "/ourmodels" ? "active" : ""}>Our Models</a></li>
        <li><a href="/contactus" className={window.location.pathname === "/contactus" ? "active" : ""}>Contact Us</a></li>
        <li><a href="/login" className={window.location.pathname === "/login" ? "active" : ""}>Login</a></li>
        <li><a href="/signup" className={window.location.pathname === "/signup" ? "active" : ""}>Signup</a></li>
      </ul>

      {/* THEME TOGGLE */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? "Light" : "Dark"}
      </button>
    </nav>
  );
}
