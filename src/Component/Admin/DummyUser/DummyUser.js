import React, { useState } from "react";
import "./DummyUser.css";

function DummyUser() {
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To disable button during submission

  const handleSubmit = async () => {
    if (query.trim() === "") {
      alert("Please enter a query");
      return;
    }

    setIsSubmitting(true); // Disable button during request

    try {
      const response = await fetch("http://localhost:5000/add-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });

      if (response.ok) {
        alert("Query submitted successfully!");
        setQuery(""); // Clear input after submission
      } else {
        alert("Failed to submit query");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the query");
    } finally {
      setIsSubmitting(false); // Enable button again
    }
  };

  return (
    <div className="dummy-user-container">
      <h2>Submit a Query</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your query here..."
      />
      <div className="button-container">
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default DummyUser;
