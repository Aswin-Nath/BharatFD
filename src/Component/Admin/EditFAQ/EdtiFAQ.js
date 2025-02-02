import React, { useState, useEffect } from "react";
import "./EditFAQ.css";

function EditFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const faqsPerPage = 5; // Number of FAQs per page

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch("http://localhost:5000/faqs");
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const deleteFAQ = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this FAQ?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/delete-faq/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("FAQ deleted successfully!");
        setFaqs(faqs.filter((faq) => faq.id !== id)); // Remove from UI
      } else {
        alert("Failed to delete FAQ.");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  // Pagination Logic
  const indexOfLastFAQ = currentPage * faqsPerPage;
  const indexOfFirstFAQ = indexOfLastFAQ - faqsPerPage;
  const currentFaqs = faqs.slice(indexOfFirstFAQ, indexOfLastFAQ);

  const nextPage = () => {
    if (currentPage < Math.ceil(faqs.length / faqsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="edit-faq-container">
      <h2>Edit FAQ</h2>
      <table className="faq-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Answer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentFaqs.length > 0 ? (
            currentFaqs.map((faq, index) => (
              <tr key={faq.id}>
                <td>{indexOfFirstFAQ + index + 1}</td>
                <td>{faq.QuestionContent}</td>
                <td>{faq.AnswerContent}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteFAQ(faq.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No FAQs available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button className="page-btn" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {Math.ceil(faqs.length / faqsPerPage)} </span>
        <button className="page-btn" onClick={nextPage} disabled={currentPage === Math.ceil(faqs.length / faqsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default EditFAQ;
