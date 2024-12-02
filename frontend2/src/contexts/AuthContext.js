import { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserInfo = async () => {
        try {
            const cookies = document.cookie.split(';');
            const hasToken = cookies.some(cookie => cookie.trim().startsWith('fastfood-session='));
            
            if (!hasToken) {
                setUser(null);
                setLoading(false);
                return;
            }

            const API_URL = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${API_URL}/user/info`, {
                withCredentials: true
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/login`, 
                { email, password },
                { withCredentials: true }
            );
            setUser(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
    };

    const hasRole = (roleName) => {
        return user?.roles?.includes(`ROLE_${roleName.toUpperCase()}`);
    };

    const register = async (fullName, email, password, confirmPassword) => {
        const response = await AuthService.register(fullName, email, password, confirmPassword);
        return response;
    };

    const loginWithGoogle = async (credential) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/google`,
                { credential },
                { withCredentials: true }
            );
            setUser(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        login,
        logout,
        register,
        loading,
        hasRole,
        isAuthenticated: !!user,
        loginWithGoogle
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={value}>
                {!loading && children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 