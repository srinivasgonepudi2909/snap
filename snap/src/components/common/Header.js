import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header style={{ background: "#111", color: "#fff", padding: "1rem" }}>
    <nav>
      <Link to="/" style={{ color: "#fff", marginRight: "1rem" }}>Home</Link>
      <Link to="/about" style={{ color: "#fff" }}>About</Link>
    </nav>
  </header>
);

export default Header;
