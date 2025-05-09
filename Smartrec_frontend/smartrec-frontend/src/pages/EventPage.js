import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const EventPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (token && token !== 'undefined' && token !== 'null') {
            // ✅ Logged in → redirect to personalized feed
            navigate('/EventFeed', { replace: true });
        } else {
            // ❌ Guest → redirect to trending page
            navigate('/TrendingEvents', { replace: true });
        }
    }, [navigate]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography variant="h6">Redirecting to news...</Typography>
        </Box>
    );
};

export default EventPage;
