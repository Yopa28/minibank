import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    userId: string;
    role: 'admin' | 'user';
    login: (userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string>(localStorage.getItem('user') || 'admin');
    const [role, setRole] = useState<'admin' | 'user'>(userId === 'admin' ? 'admin' : 'user');

    useEffect(() => {
        localStorage.setItem('user', userId);

        setRole(userId === 'admin' ? 'admin' : 'user');
    }, [userId]);

    const login = (uid: string) => {
        setUserId(uid);
    };

    const logout = () => {
        setUserId('user'); // Default back to user
    };

    return (
        <AuthContext.Provider value={{ userId, role, login, logout }}>
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
