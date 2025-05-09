import React from "react";
import TrendingNewsBlock from "../components/TrendingNewsBlock";
import TrendingEventsBlock from "../components/TrendingEventsBlock";
import { Typography, Container, Box, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';


export default function Home() {
    const navigate = useNavigate();
    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
                Welcome to SmartRec!
            </Typography>
            <Typography align="center" sx={{ mb: 4 }}>
                Get personalized News and Events at your fingertips 🚀
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap", // allows stacking on small screens
                    justifyContent: "center",
                }}
            >
                <Box sx={{ flex: "1 1 45%", minWidth: "320px" }}>
                    <Typography variant="h5" gutterBottom align="center">
                        Trending News
                    </Typography>
                    <TrendingNewsBlock />
                </Box>

                <Box sx={{ flex: "1 1 45%", minWidth: "320px" }}>
                    <Typography variant="h5" gutterBottom align="center">
                        Trending Events
                    </Typography>
                    <TrendingEventsBlock />
                </Box>
            </Box>

            {/* ✅ Buttons Section */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 4,
                    mt: 4,
                    flexWrap: "wrap",
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/news")}
                >
                    Explore News
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/events")}
                >
                    Explore Events
                </Button>
            </Box>
        </Container>
    );
}
