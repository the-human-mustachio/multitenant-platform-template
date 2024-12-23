import React from "react";
import { useAuth } from "../auth/AuthContext";


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessToken, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    // return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
