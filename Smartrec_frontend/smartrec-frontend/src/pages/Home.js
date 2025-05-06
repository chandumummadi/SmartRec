import React from 'react';
import TrendingNewsBlock from '../components/TrendingNewsBlock';
import TrendingEventsBlock from '../components/TrendingEventsBlock';

const HomePage = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Welcome to SmartRec!</h1>
            <p className="text-center mb-10">Get personalized News and Events at your fingertips 🚀</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TrendingNewsBlock />
                <TrendingEventsBlock />
            </div>
        </div>
    );
};

export default HomePage;
