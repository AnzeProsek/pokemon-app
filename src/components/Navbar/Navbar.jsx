import React, { useState } from "react";
import images from "../../constants/images";
import { Link } from "react-router-dom";

import "./Navbar.scss";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={images.smartdex} alt="logo"></img>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/favorites">Favorites</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
