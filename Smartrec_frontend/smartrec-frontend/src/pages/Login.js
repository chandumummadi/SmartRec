// src/pages/Login.jsx

import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';


const Login = () => {
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            const checkUserPreferences = async (userId, accessToken) => {
                try {
                    const response = await fetch(`http://localhost:8000/api/news/user_preferences/?user_id=${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                    if (response.ok) {
                        // Preferences found
                        return true;
                    } else if (response.status === 404) {
                        // Preferences not found
                        return false;
                    } else {
                        console.error('Unexpected error checking preferences');
                        return true; // fail-safe, treat as existing
                    }
                } catch (error) {
                    console.error('Error checking preferences:', error);
                    return true; // fail-safe
                }
            };


            if (response.ok) {
                showToast('Login successful ✅', 'success');
                login(data.access, data.refresh, data.user.full_name, data.user.user_id);

                // Check preferences now
                const hasPreferences = await checkUserPreferences(data.user.user_id, data.access);

                if (hasPreferences) {
                    navigate('/'); // Go to home
                } else {
                    navigate('/preferences'); // Redirect to preferences setup
                }
            } else {
                setError(data.detail || 'Invalid email or password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Something went wrong. Please try again.');
        }
    };


    const handleRegisterRedirect = () => {
        navigate('/register'); // Redirect to register page
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Login to SmartRec
            </Typography>

            {error && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button type="submit" variant="contained" fullWidth>
                    Login
                </Button>

                <Typography align="center" sx={{ mt: 2 }}>
                    Don't have an account?{' '}
                    <Link component="button" variant="body2" onClick={handleRegisterRedirect}>
                        Register here
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
