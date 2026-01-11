import { createContext, useContext, useState, useEffect } from 'react';
import {
    getStoredUser,
    setStoredUser,
    clearStoredUser,
    login as apiLogin,
    getProfile,
    getApiUrl
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = getStoredUser();
            const apiUrl = getApiUrl();

            if (storedUser && apiUrl) {
                try {
                    // Refresh user data from server
                    const response = await getProfile(storedUser.username);
                    if (response.success && response.data) {
                        const updatedUser = { ...storedUser, ...response.data };
                        setUser(updatedUser);
                        setStoredUser(updatedUser);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Failed to refresh user data:', error);
                    // Keep using stored data if refresh fails
                    setUser(storedUser);
                    setIsAuthenticated(true);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await apiLogin(username, password);

            if (response.success && response.data) {
                const userData = {
                    username,
                    ...response.data,
                };
                setUser(userData);
                setStoredUser(userData);
                setIsAuthenticated(true);
                return { success: true, isFirstLogin: response.isFirstLogin };
            }

            throw new Error(response.message || 'Login gagal');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        clearStoredUser();
        setIsAuthenticated(false);
    };

    const updateUser = (newData) => {
        const updatedUser = { ...user, ...newData };
        setUser(updatedUser);
        setStoredUser(updatedUser);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
