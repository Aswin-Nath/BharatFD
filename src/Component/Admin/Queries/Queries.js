import React, { useState, useEffect } from "react";
import "./Queries.css";

function Queries() {
  const [queries, setQueries] = useState([]);
  const [showAnswered, setShowAnswered] = useState(false);
  const [activeResponseId, setActiveResponseId] = useState(null);
  const [response, setResponse] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [queriesPerPage, setQueriesPerPage] = useState(5); // Default per page
  const [searchQuery, setSearchQuery] = useState(""); // Search term

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
        fetchQueries();
      } else {
        alert("Failed to add to FAQ.");
      }
    } catch (error) {
      console.error("Error adding to FAQ:", error);
    }
  };

  // Filter based on search and answered/unanswered toggle
  const filteredQueries = queries
    .filter((query) => query.isAnswered === (showAnswered ? 1 : 0))
    .filter((query) =>
      query.QuestionContent.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Pagination Logic
  const totalPages = Math.ceil(filteredQueries.length / queriesPerPage);
  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = filteredQueries.slice(indexOfFirstQuery, indexOfLastQuery);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="queries-container">
      <h2>Queries</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search queries..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Toggle Buttons */}
      <div className="toggle-container">
        <label>
          <input
            type="radio"
            name="queryType"
            checked={!showAnswered}
            onChange={() => {
              setShowAnswered(false);
              setCurrentPage(1);
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
              setCurrentPage(1);
            }}
          />
          Answered
        </label>
      </div>

      {/* Items Per Page Selection */}
      <label>Show: </label>
      <select value={queriesPerPage} onChange={(e) => setQueriesPerPage(Number(e.target.value))}>
        <option value={2}>2</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
      </select>

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
                <td>{indexOfFirstQuery + index + 1}</td>
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
                    <button className="respond-btn" onClick={() => toggleResponseBox(query.id)}>
                      {activeResponseId === query.id ? "Close" : "Respond"}
                    </button>

                    {activeResponseId === query.id && (
                      <div className="response-box">
                        <textarea
                          value={response[query.id] || ""}
                          onChange={(e) => handleResponseChange(query.id, e.target.value)}
                          placeholder="Type your response..."
                        />
                        <button className="submit-btn" onClick={() => submitResponse(query.id)}>
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
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Queries;
