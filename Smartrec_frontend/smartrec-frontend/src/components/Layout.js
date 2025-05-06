import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom'; // ⭐ IMPORTANT ⭐

const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flex: 1 }}>
                <Outlet />
            </Container>
            <Footer />
        </div>
    );
};

export default Layout;
