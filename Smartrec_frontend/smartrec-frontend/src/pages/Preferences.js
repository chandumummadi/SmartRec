import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const availableNewsCategories = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
];

const availableEventCategories = [
    'theatre',
    'rock',
    'performance_art',
    'rnb',
    'baseball',
    'equestrian',
    'football',
];

const Preferences = () => {
    const [selectedNewsCategories, setSelectedNewsCategories] = useState([]);
    const [selectedEventCategories, setSelectedEventCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { showToast } = useToast();
    const userId = localStorage.getItem('id');
    const accessToken = localStorage.getItem('access');

    useEffect(() => {
        if (!accessToken || !userId) {
            showToast('Please log in to access preferences.', 'warning');
            navigate('/login');
            return;
        }

        const fetchPreferences = async () => {
            try {
                const [newsRes, eventRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/news/user_preferences/?user_id=${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    }),
                    fetch(`http://localhost:8000/api/events/user_preferences/?user_id=${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    }),
                ]);

                const newsData = await newsRes.json();
                const eventData = await eventRes.json();

                const savedNews = newsData.preferences
                    .filter(p => p.weight > 0)
                    .map(p => p.category);

                const savedEvents = eventData.preferences
                    .filter(p => p.weight > 0)
                    .map(p => p.category);

                setSelectedNewsCategories(savedNews);
                setSelectedEventCategories(savedEvents);
            } catch (error) {
                console.error("Error loading preferences", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [userId, accessToken, navigate, showToast]);

    const handleNewsCategoryToggle = (category) => {
        setSelectedNewsCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleEventCategoryToggle = (category) => {
        setSelectedEventCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleSubmit = async () => {
        if (selectedNewsCategories.length === 0 && selectedEventCategories.length === 0) {
            showToast('Please select at least one category.', 'warning');
            return;
        }

        try {
            if (selectedNewsCategories.length > 0) {
                await fetch(`http://localhost:8000/api/news/update_user_preferences/?user_id=${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ categories: selectedNewsCategories }),
                });
            }

            if (selectedEventCategories.length > 0) {
                await fetch(`http://localhost:8000/api/events/update_user_preferences/?user_id=${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ categories: selectedEventCategories }),
                });
            }

            showToast('Preferences saved successfully! 🎯', 'success');
            navigate('/');
        } catch (error) {
            console.error('Error saving preferences:', error);
            showToast('Something went wrong.', 'error');
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Set Your Preferences
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Select the categories you are interested in.
            </Typography>

            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                News Categories
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {availableNewsCategories.map((category) => (
                    <Grid item key={category}>
                        <Button
                            variant={selectedNewsCategories.includes(category) ? 'contained' : 'outlined'}
                            onClick={() => handleNewsCategoryToggle(category)}
                        >
                            {category}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" align="center" sx={{ mt: 6, mb: 2 }}>
                Event Categories
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {availableEventCategories.map((category) => (
                    <Grid item key={category}>
                        <Button
                            variant={selectedEventCategories.includes(category) ? 'contained' : 'outlined'}
                            onClick={() => handleEventCategoryToggle(category)}
                        >
                            {category}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Button variant="contained" color="success" onClick={handleSubmit}>
                    Save Preferences
                </Button>
            </Box>
        </Container>
    );
};

export default Preferences;
