import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-ink-900">
        <Logo showWordmark={false} size={48} />
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
