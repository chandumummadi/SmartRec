import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Button, CircularProgress, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const eventCategoriesList = ['rock', 'baseball', 'theatre', 'performance_art', 'rnb', 'equestrian', 'football'];

const EventsFeed = () => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const [activeSection, setActiveSection] = useState('recommend');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSidebarClick = (section) => {
        setActiveSection(section);
        setSelectedCategories([]);
        setEvents([]);
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
            const response = await fetch(`http://localhost:8000/api/events/categories/?${query}`);
            const data = await response.json();
            const allEvents = Object.values(data.events).flat();
            setEvents(allEvents);
        } catch (error) {
            console.error('Error fetching filtered events:', error);
            showToast('Failed to fetch filtered events', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchTrending = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/events/trending/?top_n=10');
            const data = await response.json();
            setEvents(data.trending_events || []);
        } catch (error) {
            console.error('Error fetching trending events:', error);
            showToast('Failed to fetch trending events', 'error');
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
            const response = await fetch(`http://localhost:8000/api/events/recommend_events/?user_id=${userId}`);
            const data = await response.json();
            setEvents(data.recommended_events || []);
        } catch (error) {
            console.error('Error fetching recommended events:', error);
            showToast('Failed to fetch recommended events', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeSection === 'recommend') fetchRecommendations();
        else if (activeSection === 'trending') fetchTrending();
    }, [activeSection]);

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Box sx={{ width: '220px', minHeight: '100vh', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', padding: '1rem 0.5rem', position: 'fixed', top: '64px', left: 0, borderRight: '1px solid #ddd', zIndex: 10 }}>
                <Button fullWidth variant={activeSection === 'recommend' ? 'contained' : 'text'} onClick={() => handleSidebarClick('recommend')} sx={{ justifyContent: 'flex-start', paddingLeft: '16px', color: activeSection === 'recommend' ? 'white' : 'black', '&:hover': { backgroundColor: '#e0e0e0' }, mb: 1 }}>
                    Your Event Recommendations
                </Button>
                <Button fullWidth variant={activeSection === 'trending' ? 'contained' : 'text'} onClick={() => handleSidebarClick('trending')} sx={{ justifyContent: 'flex-start', paddingLeft: '16px', color: activeSection === 'trending' ? 'white' : 'black', '&:hover': { backgroundColor: '#e0e0e0' }, mb: 1 }}>
                    Trending Events
                </Button>
                <Button fullWidth variant={activeSection === 'filter' ? 'contained' : 'text'} onClick={() => handleSidebarClick('filter')} sx={{ justifyContent: 'flex-start', paddingLeft: '16px', color: activeSection === 'filter' ? 'white' : 'black', '&:hover': { backgroundColor: '#e0e0e0' } }}>
                    Filter by Category
                </Button>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, marginTop: '64px', marginLeft: '220px', padding: 3 }}>
                {/* Filter Controls */}
                {activeSection === 'filter' && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                        {eventCategoriesList.map((category) => (
                            <Button key={category} variant={selectedCategories.includes(category) ? 'contained' : 'outlined'} onClick={() => handleCategoryToggle(category)}>
                                {category}
                            </Button>
                        ))}
                        <Button variant="contained" color="success" onClick={handleFilterSubmit}>
                            Filter ✅
                        </Button>
                    </Box>
                )}

                {/* Event Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : events.length > 0 ? (
                    <Grid container spacing={3}>
                        {events.map((event) => (
                            <Grid key={event.event_id} size={{ xs: 12, sm: 6, md: 3 }} display="flex" justifyContent="center">
                                <Box sx={{ maxWidth: 450, width: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', boxShadow: 2, backgroundColor: '#fff', height: '100%', transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}>
                                    <Box sx={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                                        <img src={event.image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{event.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>{event.description ? event.description.slice(0, 80) + '...' : 'No description'}</Typography>
                                        <Typography variant="caption" color="info.main" sx={{ mb: 1 }}>{new Date(event.date).toLocaleString()} • {event.location}</Typography>
                                        <Button href={event.url} target="_blank" variant="outlined" size="small" sx={{ mt: 2 }}>View Details</Button>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 8 }}>
                        No events found.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default EventsFeed;
