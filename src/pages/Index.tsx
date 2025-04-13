
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Home from "./Home";

const Index = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <Home /> : <Navigate to="/landing" replace />;
};

export default Index;
