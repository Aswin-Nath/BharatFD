import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./FAQ.css";

function FAQ() {
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndexes, setOpenIndexes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [faqsPerPage, setFaqsPerPage] = useState(5);
    const [customPage, setCustomPage] = useState("");
    const [isLoading, setIsLoading] = useState(true); // 🔹 Added loading state

    const a = "EJUeODtTupbdSgg1irpE2SeRVQHzCPpLkvR8oECVGtnoovOT1skBJQQJ99BBACGhslBXJ3w3AAAbACOGNOXb";
    const translatorKey = a;
    const endpoint = "https://api.cognitive.microsofttranslator.com";
    const location = "centralindia";

    const toggleAnswer = (index) => {
        setOpenIndexes((prevIndexes) =>
            prevIndexes.includes(index) ? prevIndexes.filter((i) => i !== index) : [...prevIndexes, index]
        );
    };

    const translateFAQs = async (faqs, targetLanguage) => {
        try {
            const translations = await Promise.all(
                faqs.map(async (faq) => {
                    const translatedQuestion = await translateText(faq.QuestionContent, targetLanguage);
                    const translatedAnswer = await translateText(faq.AnswerContent, targetLanguage);
                    return { ...faq, QuestionContent: translatedQuestion, AnswerContent: translatedAnswer };
                })
            );
            return translations;
        } catch (error) {
            console.error("Error translating FAQs:", error);
            return faqs;
        }
    };

    const translateText = async (text, targetLanguage) => {
        try {
            const response = await axios({
                baseURL: endpoint,
                url: "/translate",
                method: "post",
                headers: {
                    "Ocp-Apim-Subscription-Key": translatorKey,
                    "Ocp-Apim-Subscription-Region": location,
                    "Content-type": "application/json",
                    "X-ClientTraceId": uuidv4(),
                },
                params: {
                    "api-version": "3.0",
                    from: "en",
                    to: targetLanguage,
                },
                data: [{ text }],
                responseType: "json",
            });

            return response.data[0].translations[0].text;
        } catch (error) {
            console.error("Translation error:", error);
            return text;
        }
    };

    const fetchFAQs = useCallback(async () => {
        setIsLoading(true); // 🔹 Show loading before fetching starts
        try {
            const response = await fetch("https://backend-omega-seven-22.vercel.app/faqs");
            const data = await response.json();

            if (selectedLanguage !== "en") {
                const translatedFAQs = await translateFAQs(data, selectedLanguage);
                setFaqs(translatedFAQs);
                setFilteredFaqs(translatedFAQs);
            } else {
                setFaqs(data);
                setFilteredFaqs(data);
            }
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
        setIsLoading(false); // 🔹 Hide loading after data is fetched
    }, [selectedLanguage]);

    useEffect(() => {
        fetchFAQs();
    }, [fetchFAQs]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setOpenIndexes([]);

        const filtered = faqs.filter(
            (faq) =>
                faq.QuestionContent.toLowerCase().includes(query) ||
                faq.AnswerContent.toLowerCase().includes(query)
        );

        setFilteredFaqs(filtered);
        setCurrentPage(1);
    };

    const indexOfLastFaq = currentPage * faqsPerPage;
    const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
    const currentFaqs = filteredFaqs.slice(indexOfFirstFaq, indexOfLastFaq);

    const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setOpenIndexes([]);
        }
    };

    const handleCustomPageChange = (e) => {
        setCustomPage(e.target.value);
    };

    const jumpToPage = () => {
        const pageNumber = parseInt(customPage, 10);
        if (!isNaN(pageNumber)) {
            handlePageChange(pageNumber);
            setCustomPage("");
        }
    };

    return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>

            {/* Language Dropdown */}
            <div className="language-selector">
                <label>Select Language:</label>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                    <option value="zh-Hans">Chinese (Simplified)</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="ta">Tamil</option>
                </select>
            </div>

            {/* Search Bar */}
            <input
                type="text"
                className="search-bar"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={handleSearch}
            />

            {/* Items Per Page Selection */}
            <label>Show: </label>
            <select value={faqsPerPage} onChange={(e) => setFaqsPerPage(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
            </select>

            {/* Loading Indicator */}
            {isLoading ? (
                <div className="loading-spinner"></div> // 🔹 Loading Animation
            ) : (
                <div className="faq-list">
                    {currentFaqs.length > 0 ? (
                        currentFaqs.map((faq, index) => (
                            <div key={index} className={`faq-item ${openIndexes.includes(index) ? "open" : ""}`}>
                                <div className="faq-question" onClick={() => toggleAnswer(index)}>
                                    {faq.QuestionContent}
                                </div>
                                {openIndexes.includes(index) && <div className="faq-answer">{faq.AnswerContent}</div>}
                            </div>
                        ))
                    ) : (
                        <p>No FAQs found.</p>
                    )}
                </div>
            )}

            {/* Pagination */}
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

                    {/* Custom Page Jump */}
                    <input type="number" value={customPage} onChange={handleCustomPageChange} placeholder="Go to page" />
                    <button onClick={jumpToPage}>Go</button>
                </div>
            )}
        </div>
    );
}

export default FAQ;
