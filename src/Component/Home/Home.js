import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <Link to="/faq" className="button">FAQ's</Link>
      <Link to="/admin" className="button">Admin Panel</Link>
    </div>
  );
}

export default Home;
