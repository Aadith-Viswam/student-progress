
import { createContext, useState, useEffect } from "react";
import { checkAuth } from "../backend/authApi";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // user object
    const [loading, setLoading] = useState(true); // loading while checking

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const currentUser = await checkAuth(); // calls backend /check
            setUser(currentUser);
            setLoading(false);
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
