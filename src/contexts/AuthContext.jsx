import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [bootstrapped, setBootstrapped] = useState(false);

    // --------------------------------
    // Bootstrap auth state on refresh
    // --------------------------------
    useEffect(() => {
        let mounted = true;

        const bootstrap = async () => {
            try {
                const current = await authService.getCurrentUser();
                if (mounted) {
                    setUser(current);
                }
            } finally {
                if (mounted) {
                    setBootstrapped(true);
                }
            }
        };

        bootstrap();

        return () => {
            mounted = false;
        };
    }, []);

    // --------------------------------
    // Auth actions
    // --------------------------------
    const register = async (payload) => {
        const res = await authService.register(payload);
        if (res.ok) {
            setUser(res.user);
        }
        return res;
    };

    const login = async (payload) => {
        const res = await authService.login(payload);
        if (res.ok) {
            setUser(res.user);
        }
        return res;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // --------------------------------
    // Memoized context value
    // --------------------------------
    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            bootstrapped,
            register,
            login,
            logout,
        }),
        [user, bootstrapped]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// --------------------------------
// Hook
// --------------------------------
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
};
