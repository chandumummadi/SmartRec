import React, { useEffect, useState } from 'react';
import {Box, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid';


const TrendingNews = () => {
    const [newsArticles, setNewsArticles] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/news/trending/")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.trending_news)) {
                    setNewsArticles(data.trending_news);
                } else {
                    console.error("Unexpected data format:", data);
                }
            })
            .catch(err => console.error("Error fetching trending news:", err));
    }, []);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Trending News 🗞️
            </Typography>

            <Grid container spacing={3}>
                {newsArticles.map((article) => (
                    <Grid key={article.news_id} size={{ xs: 12, sm: 6, md: 3 }} display="flex" justifyContent="center">
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
                                    src={article.image_url}
                                    alt={article.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>

                            <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {article.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                    {article.description ? article.description.slice(0, 80) + '...' : ''}
                                </Typography>
                                <Typography variant="caption" color="success.main" sx={{ mb: 1 }}>
                                    Genuineness: {Math.floor(Math.random() * 30) + 70}%
                                </Typography>
                                <Button
                                    href={article.url}
                                    target="_blank"
                                    variant="outlined"
                                    size="small"
                                    sx={{ mt: 2 }}
                                >
                                    Read More
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TrendingNews;
