import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="body2">
                © {new Date().getFullYear()} SmartRec. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
