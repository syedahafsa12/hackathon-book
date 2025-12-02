import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    name: string;
    profile?: {
        software_background?: string;
        hardware_background?: string;
        operating_system?: string;
        gpu_hardware?: string;
        experience_level?: string;
        preferred_language?: string;
    };
}

interface AuthContextType {
    user: User | null;
    sessionToken: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function BetterAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const storedToken = localStorage.getItem('session_token');
        if (storedToken) {
            setSessionToken(storedToken);
            fetchUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                // Invalid token, clear it
                logout();
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (token: string) => {
        localStorage.setItem('session_token', token);
        setSessionToken(token);
        fetchUser(token);
    };

    const logout = () => {
        localStorage.removeItem('session_token');
        setSessionToken(null);
        setUser(null);

        // Call backend logout
        if (sessionToken) {
            fetch('http://localhost:8000/api/auth/signout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionToken}`,
                },
                credentials: 'include',
            }).catch(console.error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            sessionToken,
            login,
            logout,
            isAuthenticated: !!user,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useBetterAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useBetterAuth must be used within a BetterAuthProvider');
    }
    return context;
}
