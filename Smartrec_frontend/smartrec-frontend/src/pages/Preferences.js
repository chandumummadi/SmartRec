// src/pages/Preferences.jsx

import React, { useState } from 'react';
import { Box, Button, Typography, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const availableCategories = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
];

const Preferences = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleCategoryToggle = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleSubmit = async () => {
        if (selectedCategories.length === 0) {
            showToast('Please select at least one category.', 'warning');
            return;
        }

        const userId = localStorage.getItem('id');
        const accessToken = localStorage.getItem('access');

        try {
            const response = await fetch(`http://localhost:8000/api/news/update_user_preferences/?user_id=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    categories: selectedCategories,  // ⭐ Important: use `categories`
                }),
            });

            if (response.ok) {
                showToast('Preferences saved successfully! 🎯', 'success');
                navigate('/');
            } else {
                showToast('Failed to save preferences. Try again.', 'error');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            showToast('Something went wrong.', 'error');
        }
    };


    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Set Your Preferences
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Select the categories you are interested in.
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {availableCategories.map((category) => (
                    <Grid item key={category}>
                        <Button
                            variant={selectedCategories.includes(category) ? 'contained' : 'outlined'}
                            onClick={() => handleCategoryToggle(category)}
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
