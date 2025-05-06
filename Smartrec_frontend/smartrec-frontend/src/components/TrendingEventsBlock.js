import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrendingEventsBlock = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/api/events/trending/")
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error("Error fetching trending events:", err));
    }, []);

    const handleViewMore = () => {
        navigate("/events?mode=trending");
    };

    return (
        <div className="border rounded-lg shadow-md p-4 bg-white">
            <h2 className="text-xl font-semibold mb-4">Trending Events</h2>
            {events.length === 0 && <p>Loading...</p>}
            <ul className="space-y-2">
                {events.map((event, index) => (
                    <li key={index} className="text-sm">
                        <div className="text-gray-800 font-medium">{event.event_name}</div>
                        <div className="text-xs text-gray-500">{event.date} | {event.location}</div>
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

export default TrendingEventsBlock;
