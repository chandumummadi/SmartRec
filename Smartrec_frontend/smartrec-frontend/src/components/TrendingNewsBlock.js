import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrendingNewsBlock = () => {
    const [news, setNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/api/news/trending/")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setNews(data);  // if backend sends a raw list
                } else if (Array.isArray(data.results)) {
                    setNews(data.results); // if backend wraps inside `results`
                } else if (Array.isArray(data.news)) {
                    setNews(data.news);  // if wrapped inside `news`
                } else {
                    console.error("Unexpected response format", data);
                }
            })
            .catch(err => console.error("Error fetching trending news:", err));
    }, []);


    const handleViewMore = () => {
        navigate("/news?mode=trending");
    };

    return (
        <div className="border rounded-lg shadow-md p-4 bg-white">
            <h2 className="text-xl font-semibold mb-4">Trending News</h2>
            {news.length === 0 && <p>Loading...</p>}
            <ul className="space-y-2">
                {news.map((article, index) => (
                    <li key={index} className="text-sm">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {article.title}
                        </a>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleViewMore}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                View More
            </button>
        </div>
    );
};

export default TrendingNewsBlock;
