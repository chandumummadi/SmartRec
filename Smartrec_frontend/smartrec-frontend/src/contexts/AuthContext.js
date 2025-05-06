// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Hook to use AuthContext easily
export function useAuth() {
    return useContext(AuthContext);
}

// Provider component
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [fullName, setFullName] = useState('');

    // Check localStorage when app loads
    useEffect(() => {
        const token = localStorage.getItem('access');
        const name = localStorage.getItem('full_name');

        if (token && name) {
            setIsAuthenticated(true);
            setFullName(name);
        }
    }, []);

    // Login function (after successful login API call)
    const login = (accessToken, refreshToken, userFullName, userId) => {
        localStorage.setItem('access', accessToken);
        localStorage.setItem('refresh', refreshToken);
        localStorage.setItem('full_name', userFullName);
        localStorage.setItem('id', userId); // ⭐ NEW LINE

        setIsAuthenticated(true);
        setFullName(userFullName);
    };

    // Logout function
    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh');
            const accessToken = localStorage.getItem('access');

            // Call logout API
            await fetch('http://localhost:8000/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            // Clear localStorage and reset auth state
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('full_name');

            setIsAuthenticated(false);
            setFullName('');
            window.location.href = '/'; // Redirect to homepage
        }
    };
    // inside AuthProvider (contexts/AuthContext.jsx)

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refresh');

        if (!refreshToken) {
            console.error('No refresh token available.');
            return false;
        }

        try {
            const response = await fetch('http://localhost:8000/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save new access token
                localStorage.setItem('access', data.access);
                console.log('Access token refreshed ✅');
                return true;
            } else {
                console.error('Failed to refresh token:', data);
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, fullName, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}
