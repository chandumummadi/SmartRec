import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';

const TrendingEventsBlock = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/events/trending/?top_n=5')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.trending_events)) {
                    setEvents(data.trending_events.slice(0, 4));
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch((err) => console.error('Error fetching trending events:', err));
    }, []);

    return (
        <Grid container spacing={3}>
            {events.map((event) => (
                <Grid item key={event.event_id} size={{ xs: 12, sm: 6 }}>
                    <Box
                        sx={{
                            maxWidth: 360,
                            width: '100%',
                            height: 300, // ✅ consistent fixed height
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 2,
                            backgroundColor: '#fff',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'scale(1.02)' },
                        }}
                    >
                        {/* Image */}
                        <Box sx={{ width: '100%', height: 160, overflow: 'hidden' }}>
                            <img
                                src={event.image_url}
                                alt={event.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>

                        {/* Content */}
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                gutterBottom
                                sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {event.title}
                            </Typography>

                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                {new Date(event.date).toLocaleString()} — {event.location}
                            </Typography>

                            <Button
                                href={event.url}
                                target="_blank"
                                variant="outlined"
                                size="small"
                                sx={{ mt: 'auto' }}
                            >
                                View Event
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default TrendingEventsBlock;
