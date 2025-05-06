// src/components/Navbar.jsx

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // ⭐ Use our AuthContext

const Navbar = () => {
    const { isAuthenticated, fullName, logout } = useAuth(); // Grab auth state
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        navigate('/profile');
        handleMenuClose();
    };

    const handleLogout = async () => {
        await logout(); // Calls logout function from context
        handleMenuClose();
    };

    const handleLogin = () => {
        navigate('/login'); // Redirect to login page (or show popup)
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Logo / Title */}
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    SmartRec
                </Typography>

                {/* Navigation Links */}
                <Button color="inherit" component={Link} to="/news">News</Button>
                <Button color="inherit" component={Link} to="/events">Events</Button>
                <Button color="inherit" component={Link} to="/profile">Profile</Button>

                {/* Auth Section */}
                {isAuthenticated ? (
                    <>
                        <Button color="inherit" onClick={handleMenuOpen}>
                            Welcome, {fullName.split(' ')[0]} ⌄
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button color="inherit" onClick={handleLogin}>
                        Sign In
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
