import React, { useState, useEffect } from "react";
import "./Queries.css";

function Queries() {
  const [queries, setQueries] = useState([]);
  const [showAnswered, setShowAnswered] = useState(false);
  const [activeResponseId, setActiveResponseId] = useState(null);
  const [response, setResponse] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const queriesPerPage = 2; // Limit per page

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await fetch("https://backend-6jqv.onrender.com/queries");
      const data = await response.json();
      setQueries(data.sort((a, b) => a.isAnswered - b.isAnswered));
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const handleResponseChange = (id, value) => {
    setResponse({ ...response, [id]: value });
  };

  const toggleResponseBox = (id) => {
    setActiveResponseId(activeResponseId === id ? null : id);
  };

  const submitResponse = async (id) => {
    if (!response[id] || response[id].trim() === "") {
      alert("Please enter a response before submitting.");
      return;
    }

    try {
      const res = await fetch("https://backend-6jqv.onrender.com/respond-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, answer: response[id] }),
      });

      if (res.ok) {
        alert("Response submitted successfully!");
        setResponse({ ...response, [id]: "" });
        setActiveResponseId(null);
        fetchQueries(); // Refresh and reorder queries
      } else {
        alert("Failed to submit response.");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const addToFAQ = async (id, question, answer) => {
    try {
      const res = await fetch("https://backend-6jqv.onrender.com/add-to-faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      if (res.ok) {
        alert("Successfully added to FAQ!");
        fetchQueries(); // Refresh the list after adding to FAQ
      } else {
        alert("Failed to add to FAQ.");
      }
    } catch (error) {
      console.error("Error adding to FAQ:", error);
    }
  };

  // Filtered queries based on answered/unanswered selection
  const filteredQueries = queries.filter((query) => query.isAnswered === (showAnswered ? 1 : 0));

  // Pagination Logic (Using filteredQueries length)
  const totalPages = Math.ceil(filteredQueries.length / queriesPerPage);
  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = filteredQueries.slice(indexOfFirstQuery, indexOfLastQuery);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="queries-container">
      <h2>Queries</h2>

      {/* Toggle Buttons */}
      <div className="toggle-container">
        <label>
          <input
            type="radio"
            name="queryType"
            checked={!showAnswered}
            onChange={() => {
              setShowAnswered(false);
              setCurrentPage(1); // Reset to first page
            }}
          />
          Unanswered
        </label>
        <label>
          <input
            type="radio"
            name="queryType"
            checked={showAnswered}
            onChange={() => {
              setShowAnswered(true);
              setCurrentPage(1); // Reset to first page
            }}
          />
          Answered
        </label>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            {showAnswered ? <th>Answer</th> : <th>Respond</th>}
            {showAnswered && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {currentQueries.length > 0 ? (
            currentQueries.map((query, index) => (
              <tr key={query.id}>
                <td>{indexOfFirstQuery + index + 1}</td> {/* Dynamic numbering */}
                <td>{query.QuestionContent}</td>
                {showAnswered ? (
                  <>
                    <td>{query.AnswerContent}</td>
                    <td>
                      <button
                        className="add-to-faq-btn"
                        onClick={() =>
                          addToFAQ(query.id, query.QuestionContent, query.AnswerContent)
                        }
                      >
                        Add to FAQ
                      </button>
                    </td>
                  </>
                ) : (
                  <td>
                    {/* Respond Button */}
                    <button
                      className="respond-btn"
                      onClick={() => toggleResponseBox(query.id)}
                    >
                      {activeResponseId === query.id ? "Close" : "Respond"}
                    </button>

                    {/* Response Box */}
                    {activeResponseId === query.id && (
                      <div className="response-box">
                        <textarea
                          value={response[query.id] || ""}
                          onChange={(e) =>
                            handleResponseChange(query.id, e.target.value)
                          }
                          placeholder="Type your response..."
                        />
                        <button
                          className="submit-btn"
                          onClick={() => submitResponse(query.id)}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Queries available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Queries;
