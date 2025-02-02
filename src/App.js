import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import EdtiFAQ from "./Component/Admin/EditFAQ/EdtiFAQ";
import FAQ from "./Component/FAQ/FAQ";
import DummyUser from "./Component/Admin/DummyUser/DummyUser";
import Home from "./Component/Home/Home";
import AdminPanel from "./Component/Admin/AdminHome/AdminPanel";
import Queries from "./Component/Admin/Queries/Queries";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/queries" element={<Queries />} />
          <Route path="/admin/edit-faq" element={<EdtiFAQ />} />
          <Route path="/admin/dummy-user" element={<DummyUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
