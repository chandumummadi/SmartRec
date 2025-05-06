// src/pages/NewsFeed.jsx

import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Button, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const categoriesList = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

const NewsFeed = () => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const [activeSection, setActiveSection] = useState('recommend'); // recommend, trending, filter
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newsArticles, setNewsArticles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSidebarClick = (section) => {
        setActiveSection(section);
        setSelectedCategories([]);
        setNewsArticles([]);
    };

    const handleCategoryToggle = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleFilterSubmit = async () => {
        if (selectedCategories.length === 0) {
            showToast('Please select at least one category', 'warning');
            return;
        }

        try {
            setLoading(true);
            const query = selectedCategories.map((cat) => `categories=${cat}`).join('&');
            const response = await fetch(`http://localhost:8000/api/news/categories/?${query}`);
            const data = await response.json();
            const allArticles = Object.values(data.articles).flat(); // Flatten articles from different categories
            setNewsArticles(allArticles);
        } catch (error) {
            console.error('Error fetching filtered news:', error);
            showToast('Failed to fetch filtered news', 'error');
        } finally {
            setLoading(false);
        }
    };
    const handleClick = async (userId, newsId, token) => {
        try {
            await fetch(`http://localhost:8000/api/news/handle_click/?user_id=${userId}&news_id=${newsId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Click logged successfully');
        } catch (error) {
            console.error('Error logging click:', error);
        }
    };



    const fetchTrending = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/news/trending/');
            const data = await response.json();
            setNewsArticles(data.trending_news || []);
        } catch (error) {
            console.error('Error fetching trending news:', error);
            showToast('Failed to fetch trending news', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('id');

            if (!userId) {
                showToast('User not logged in', 'error');
                return;
            }

            const response = await fetch(`http://localhost:8000/api/news/recommend_news/?user_id=${userId}`);
            const data = await response.json();

            setNewsArticles(data.recommended_articles || []);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            showToast('Failed to fetch recommendations', 'error');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (activeSection === 'recommend') {
            fetchRecommendations();
        } else if (activeSection === 'trending') {
            fetchTrending();
        }
        // For filter, do nothing initially
    }, [activeSection]);


    const userId = localStorage.getItem('id');
    const accessToken = localStorage.getItem('access'); // Adjust key based on your auth setup

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: '220px',
                    minHeight: '100vh',
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1rem 0.5rem',
                    position: 'fixed',
                    top: '64px',
                    left: 0,
                    borderRight: '1px solid #ddd',
                    zIndex: 10,
                }}
            >
                <Button
                    fullWidth
                    variant={activeSection === 'recommend' ? 'contained' : 'text'}
                    onClick={() => handleSidebarClick('recommend')}
                    sx={{
                        justifyContent: 'flex-start',
                        paddingLeft: '16px',
                        color: activeSection === 'recommend' ? 'white' : 'black',
                        '&:hover': { backgroundColor: '#e0e0e0' },
                        mb: 1,
                    }}
                >
                    Your Recommendations
                </Button>

                <Button
                    fullWidth
                    variant={activeSection === 'trending' ? 'contained' : 'text'}
                    onClick={() => handleSidebarClick('trending')}
                    sx={{
                        justifyContent: 'flex-start',
                        paddingLeft: '16px',
                        color: activeSection === 'trending' ? 'white' : 'black',
                        '&:hover': { backgroundColor: '#e0e0e0' },
                        mb: 1,
                    }}
                >
                    Trending Today
                </Button>

                <Button
                    fullWidth
                    variant={activeSection === 'filter' ? 'contained' : 'text'}
                    onClick={() => handleSidebarClick('filter')}
                    sx={{
                        justifyContent: 'flex-start',
                        paddingLeft: '16px',
                        color: activeSection === 'filter' ? 'white' : 'black',
                        '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                >
                    Filter Your Own
                </Button>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, marginTop: '64px', marginLeft: '220px', padding: 3 }}>
                {/* Sub-Navbar for Filter */}
                {activeSection === 'filter' && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                        {categoriesList.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategories.includes(category) ? 'contained' : 'outlined'}
                                onClick={() => handleCategoryToggle(category)}
                            >
                                {category}
                            </Button>
                        ))}
                        <Button variant="contained" color="success" onClick={handleFilterSubmit}>
                            Filter ✅
                        </Button>
                    </Box>
                )}

                {/* News Articles */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : newsArticles.length > 0 ? (
                    <Grid container spacing={3}>
                        {newsArticles.map((article) => (
                            <Grid key={article.news_id} size={{ xs: 12, sm: 6, md: 4 }} display="flex" justifyContent="center">
                                <Box
                                    sx={{
                                        maxWidth: 450,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: 2,
                                        backgroundColor: '#fff',
                                        height: '100%',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                    }}
                                >
                                    {/* Image */}
                                    <Box sx={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>

                                    {/* Content */}
                                    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            {article.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                            {article.description ? article.description.slice(0, 80) + '...' : ''}
                                        </Typography>
                                        {/* ⭐ Genuineness Score */}
                                        <Typography variant="caption" color="success.main" sx={{ mb: 1 }}>
                                            Genuineness: {Math.floor(Math.random() * 30) + 70}% {/* Mock 70% to 100% */}
                                        </Typography>

                                        {/* Read More */}
                                        <Button
                                            href={article.url}
                                            target="_blank"
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 2 }}
                                            onClick={() => handleClick(userId, article.news_id, accessToken)}
                                        >
                                            Read More
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 8 }}>
                        No news articles found.
                    </Typography>
                )}
            </Box>

        </Box>
    );

};

export default NewsFeed;
