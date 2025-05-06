import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewsPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (token && token !== 'undefined' && token !== 'null') {
            // ✅ Logged in → redirect to personalized feed
            navigate('/newsfeed', { replace: true });
        } else {
            // ❌ Guest → redirect to trending page
            navigate('/trendingnewspage', { replace: true });
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl">Redirecting to news...</p>
        </div>
    );
};

export default NewsPage;
