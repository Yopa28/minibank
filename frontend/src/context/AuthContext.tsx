import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    user: { id: string; role: 'admin' | 'user' } | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<AuthContextType['user']>(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            try {
                const payload = JSON.parse(atob(savedToken.split('.')[1]));
                return { id: payload.id, role: payload.role };
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        try {
            const payload = JSON.parse(atob(newToken.split('.')[1]));
            setUser({ id: payload.id, role: payload.role });
        } catch (e) {
            setUser(null);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
