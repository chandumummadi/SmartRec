import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewsFeed from './pages/NewsFeed';
import EventFeed from './pages/EventFeed';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Preferences from './pages/Preferences';
import NewsPage from './pages/NewsPage'; // ➡️ new smart redirector
import EventPage from './pages/EventPage'
import TrendingNewsPage from './pages/TrendingNewsPage'; // ➡️ guest-only trending news
import TrendingEvents from './pages/TrendingEventsPage'; // ➡️ guest-only trending events (we will create this next)

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />

                    {/* Updated News and Events Routing */}
                    <Route path="news" element={<NewsPage />} /> {/* Smart Redirect */}
                    <Route path="newsfeed" element={<NewsFeed />} /> {/* Old Personalized */}
                    <Route path="trendingnewspage" element={<TrendingNewsPage />} /> {/* New Guest Trending */}

                    <Route path="events" element={<EventPage />} /> {/* Similar redirect logic - we'll create */}
                    <Route path="eventfeed" element={<EventFeed />} /> {/* Personalized Event feed */}
                    <Route path="trendingevents" element={<TrendingEvents />} /> {/* Guest Trending Events */}

                    {/* Other normal pages */}
                    <Route path="profile" element={<Profile />} />
                    <Route path="/preferences" element={<Preferences />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
