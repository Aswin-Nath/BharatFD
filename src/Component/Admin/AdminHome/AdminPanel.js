import React from "react";
import { Link } from "react-router-dom";
import "./AdminPanel.css";

function AdminPanel() {
  return (
    <div className="admin-panel-container">

      <div className="nav-links">
      <h2>Admin Panel</h2>
        <Link to="/admin/queries" className="unanswered">Queries</Link>
        <Link to="/admin/edit-faq" className="edit-faq">Edit FAQ</Link>
        <Link to="/admin/dummy-user" className="dummy-user">Dummy User</Link>
      </div>
    </div>
  );
}

export default AdminPanel;
