import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';

const TrendingNewsBlock = () => {
    const [newsArticles, setNewsArticles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/news/trending')  // backend returns all, we slice
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.trending_news)) {
                    setNewsArticles(data.trending_news.slice(0, 4));
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch((err) => console.error('Error fetching trending news:', err));
    }, []);

    return (
        <Grid container spacing={3}>
            {newsArticles.map((article) => (
                <Grid item key={article.news_id} size={{ xs: 12, sm: 6 }}>
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

                    {/* Bigger image */}
                        <Box sx={{ width: '100%', height: 160, overflow: 'hidden' }}>
                            <img
                                src={article.image_url}
                                alt={article.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>

                        {/* Content + pinned button */}
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                            }}
                        >
                            {/* One-line, ellipsized title */}
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                gutterBottom
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2, // allow 2 lines
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {article.title}
                            </Typography>

                            {/* Sticks to bottom */}
                            <Button
                                href={article.url}
                                target="_blank"
                                variant="outlined"
                                size="small"
                                sx={{ mt: 'auto' }}
                            >
                                Read More
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default TrendingNewsBlock;
