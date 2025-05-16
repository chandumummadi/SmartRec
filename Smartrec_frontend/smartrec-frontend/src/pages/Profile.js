import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Profile = () => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { refreshAccessToken } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                let accessToken = localStorage.getItem('access');

                let response = await fetch('http://localhost:8000/profile/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.status === 401) {
                    const refreshed = await refreshAccessToken();
                    if (refreshed) {
                        accessToken = localStorage.getItem('access');
                        response = await fetch('http://localhost:8000/profile/', {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                            },
                        });
                    }
                }

                const data = await response.json();

                if (response.ok) {
                    setProfile(data);
                } else {
                    showToast('Failed to load profile', 'error');
                }
            } catch (error) {
                console.error('Profile fetch error:', error);
                showToast('Something went wrong. Try again.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, navigate, showToast]);

    if (loading) {
        return (
            <Container sx={{ mt: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Profile
            </Typography>

            {profile ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6">Full Name: {profile.full_name}</Typography>
                    <Typography variant="h6">Email: {profile.email}</Typography>
                </Box>
            ) : (
                <Typography color="error" align="center">
                    No profile data found.
                </Typography>
            )}

            <Stack spacing={2} sx={{ mt: 4 }} direction="column" alignItems="center">
                <Button variant="contained" onClick={() => navigate('/preferences')}>
                    See or Edit Preferences
                </Button>
                <Button variant="text" onClick={() => navigate('/')}>
                    Go Home
                </Button>
            </Stack>
        </Container>
    );
};

export default Profile;
