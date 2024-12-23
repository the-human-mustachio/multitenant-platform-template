import React from "react";
import { useAuth } from "../auth/AuthContext";

const LoginPage: React.FC = () => {
  const { login, isAuthenticating } = useAuth();
    console.log("LOGIN PAGE!!")
  return (
    <div>
      {isAuthenticating ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h1>Login</h1>
          <button onClick={login}>Login with OAuth2</button>
        </>
      )}
    </div>
  );
};

export default LoginPage;
