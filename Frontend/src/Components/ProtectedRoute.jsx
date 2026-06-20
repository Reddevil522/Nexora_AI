import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f0f0f', color: '#ff9d4d' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;