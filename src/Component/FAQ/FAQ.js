import React, { useState, useEffect } from "react";
import "./FAQ.css";

function FAQ() {
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]); // Store filtered FAQs
    const [searchQuery, setSearchQuery] = useState(""); // Search input
    const [openIndexes, setOpenIndexes] = useState([]); // Track multiple open FAQs
    const [currentPage, setCurrentPage] = useState(1); // Current Page
    const faqsPerPage = 5; // Number of FAQs per page

    useEffect(() => {
        fetchFAQs();
    }, []);

    // Fetch FAQs from backend
    const fetchFAQs = async () => {
        try {
            const response = await fetch("http://localhost:5000/faqs");
            const data = await response.json();
            setFaqs(data);
            setFilteredFaqs(data); // Initialize filtered list
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };

    // Toggle FAQ answer visibility (Multiple FAQs can be opened)
    const toggleAnswer = (index) => {
        setOpenIndexes((prevIndexes) =>
            prevIndexes.includes(index)
                ? prevIndexes.filter((i) => i !== index) // Close if already open
                : [...prevIndexes, index] // Otherwise, add to open list
        );
    };

    // Handle Search Input (Collapse all and filter results)
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Collapse all FAQs when searching
        setOpenIndexes([]);

        const filtered = faqs.filter(
            (faq) =>
                faq.QuestionContent.toLowerCase().includes(query) ||
                faq.AnswerContent.toLowerCase().includes(query)
        );

        setFilteredFaqs(filtered);
        setCurrentPage(1); // Reset to first page on search
    };

    // Pagination Logic
    const indexOfLastFaq = currentPage * faqsPerPage;
    const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
    const currentFaqs = filteredFaqs.slice(indexOfFirstFaq, indexOfLastFaq);

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setOpenIndexes([]); // Close all FAQs when changing pages
    };

    // Next Page
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredFaqs.length / faqsPerPage)) {
            setCurrentPage(currentPage + 1);
            setOpenIndexes([]); // Close all FAQs when changing pages
        }
    };

    // Previous Page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setOpenIndexes([]); // Close all FAQs when changing pages
        }
    };

    return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>

            {/* Search Bar */}
            <input
                type="text"
                className="search-bar"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={handleSearch}
            />

            <div className="faq-list">
                {currentFaqs.length > 0 ? (
                    currentFaqs.map((faq, index) => {
                        const actualIndex = indexOfFirstFaq + index; // Adjust index for pagination
                        return (
                            <div key={actualIndex} className={`faq-item ${openIndexes.includes(actualIndex) ? "open" : ""}`}>
                                {/* Upper part: Question */}
                                <div className="faq-question" onClick={() => toggleAnswer(actualIndex)}>
                                    {faq.QuestionContent}
                                    <span className={`arrow ${openIndexes.includes(actualIndex) ? "open" : ""}`}>&#9662;</span>
                                </div>

                                {/* Lower part: Answer (Hidden by default) */}
                                {openIndexes.includes(actualIndex) && (
                                    <div className="faq-answer">
                                        {faq.AnswerContent}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>No FAQs found.</p>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                    ⬅ Previous
                </button>
                <button onClick={nextPage} disabled={currentPage >= Math.ceil(filteredFaqs.length / faqsPerPage)}>
                    Next ➡
                </button>
            </div>
        </div>
    );
}

export default FAQ;
