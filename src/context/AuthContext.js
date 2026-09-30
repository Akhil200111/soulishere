'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize token from localStorage (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } else {
                setLoading(false);
            }
        }
    }, []);

    // Fetch user when token changes
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/auth/me');
                setUser(res.data.data);
            } catch (err) {
                if (err.response?.status !== 401) {
                    console.error('Error fetching user:', err);
                }
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
                delete axios.defaults.headers.common['Authorization'];
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const { token: newToken, user: userData } = res.data;

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', newToken);
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setToken(newToken);
            setUser(userData);
            return { success: true, isAdmin: userData.role === 'admin' };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post('/api/auth/register', { name, email, password });
            const { token: newToken, user: userData } = res.data;

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', newToken);
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setToken(newToken);
            setUser(userData);
            return { success: true, isAdmin: userData.role === 'admin' };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
