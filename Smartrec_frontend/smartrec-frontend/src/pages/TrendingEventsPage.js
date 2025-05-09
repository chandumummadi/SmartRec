import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid';

const TrendingEvents = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/events/trending/?top_n=10")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.trending_events)) {
                    setEvents(data.trending_events);
                } else {
                    console.error("Unexpected data format:", data);
                }
            })
            .catch(err => console.error("Error fetching trending events:", err));
    }, []);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Trending Events 🎟️
            </Typography>

            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid key={event.event_id} size={{ xs: 12, sm: 6, md: 3 }} display="flex" justifyContent="center">
                        <Box
                            sx={{
                                maxWidth: 400,
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
                            <Box sx={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>

                            <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                    {event.description ? event.description.slice(0, 80) + '...' : 'No description'}
                                </Typography>
                                <Typography variant="caption" color="info.main">
                                    {new Date(event.date).toLocaleString()} • {event.location}
                                </Typography>
                                <Button
                                    href={event.url}
                                    target="_blank"
                                    variant="outlined"
                                    size="small"
                                    sx={{ mt: 2 }}
                                >
                                    View Details
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TrendingEvents;
