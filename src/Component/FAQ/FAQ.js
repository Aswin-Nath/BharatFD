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
    const faqsPerPage = 5;
    

    useEffect(() => {
        fetchFAQs();
    }, [fetchFAQs]);

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
    const a="EJUeODtTupbdSgg1irpE2SeRVQHzCPpLkvR8oECVGtnoovOT1skBJQQJ99BBACGhslBXJ3w3AAAbACOGNOXb";
    const toggleAnswer = (index) => {
        setOpenIndexes((prevIndexes) =>
            prevIndexes.includes(index) ? prevIndexes.filter((i) => i !== index) : [...prevIndexes, index]
        );
    };
    const translatorKey = a;
    const endpoint = "https://api.cognitive.microsofttranslator.com";
    const location = "centralindia";

    const fetchFAQs = useCallback(async () => {
        try {
            const response = await fetch("https://backend-6jqv.onrender.com/faqs");
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
    }, [selectedLanguage]);

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

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setOpenIndexes([]);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setOpenIndexes([]);
        }
    };

    return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>

            {/* Language Dropdown */}
            <div className="language-selector">
                <label htmlFor="language-dropdown">Select Language:</label>
                <div className="custom-dropdown">
                    <select
                        id="language-dropdown"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
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
            </div>

            {/* Search Bar */}
            <input
                type="text"
                className="search-bar"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={handleSearch}
            />

            {/* FAQ List */}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1} className="nav-button">
                        Previous
                    </button>
                    <button onClick={nextPage} disabled={currentPage === totalPages} className="nav-button">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default FAQ;
