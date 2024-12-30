import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken, isAuthenticating } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("Pro Route");
    console.log(isAuthenticating);

    if (!isAuthenticating) {
      if (accessToken) {
        console.log("AT Yes");
        setIsAuthenticated(true);
      } else {
        console.log("AT NO");
        setIsAuthenticated(false);
      }
    }
  }, [isAuthenticating, accessToken]);

  if (isAuthenticating) {
    return <div>Loading...</div>; // Show a loading state while authenticating
  } else {
  }

  if (isAuthenticated === false) {
    console.log("Is Auth" + isAuthenticated);
    // return <Navigate to="/login" replace />; // Redirect to login page if not authenticated
  }

  return <>{children}</>; // Render children if authenticated
};

export default ProtectedRoute;
