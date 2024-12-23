import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const CallbackHandler: React.FC = () => {
  const { isAuthenticating } = useAuth();
  const navigate = useNavigate();
  console.log("Callback Handler!!!!!!");
  console.log(isAuthenticating);
  useEffect(() => {
    if (!isAuthenticating) {
      console.log("IS NOT AUTHENTICATING");
      // Redirect to home once authentication is complete
      navigate("/home");
    } else {
      console.log("IS AUTHENTICATING");
    }
  }, [isAuthenticating, navigate]);

  return <div>Processing login...</div>;
};

export default CallbackHandler;
