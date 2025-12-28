import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, bootstrapped } = useAuth();
    const location = useLocation();

    // Still checking auth (JWT / API)
    if (!bootstrapped) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-gray-500 text-sm">Checking session...</span>
            </div>
        );
    }

    // Not authenticated → redirect to login
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
};

export default ProtectedRoute;
