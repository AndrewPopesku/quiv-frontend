import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { UserService } from "@/api";
import type { User } from "@/api/models/User";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (access: string, refresh: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const me = await UserService.userMeRetrieve();
            setUser(me);
        } catch {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = (access: string, refresh: string) => {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
