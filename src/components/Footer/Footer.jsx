import React from "react";
import "./Footer.scss";
import { Link, useScrollToTop } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link className="footer-link" to="/" onClick={scrollToTop}>
          Home
        </Link>
        <Link className="footer-link" to="/favorites" onClick={scrollToTop}>
          Favorites
        </Link>
      </div>
      <div className="footer-text">
        &copy; {new Date().getFullYear()} SmartDex
      </div>
    </footer>
  );
}

export default Footer;
