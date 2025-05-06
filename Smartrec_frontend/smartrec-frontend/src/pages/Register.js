// src/pages/Register.jsx

import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const Register = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // ⭐ NEW
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Registration successful ✅', 'success');
                navigate('/login'); // Redirect to login page after registration
            } else {
                setError(data.detail || 'Registration failed. Try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Something went wrong. Please try again.');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Create a New Account
            </Typography>

            {error && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />

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

                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <Button type="submit" variant="contained" fullWidth>
                    Register
                </Button>

                <Typography align="center" sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Link component="button" variant="body2" onClick={handleLoginRedirect}>
                        Login here
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;
