import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode"; // You can replace this with a better library like 'jwt-decode' or 'Jose'
import { createClient } from "@openauthjs/openauth/client";

// Client setup
const client = createClient({
  clientID: "react",
  issuer: `${import.meta.env.VITE_AUTH_ENDPOINT}`,
});
console.log(import.meta.env);

// Define the shape of the authentication context value
interface AuthContextType {
  isAuthenticating: boolean;
  userId: string | undefined;
  login: () => Promise<void>;
  logout: () => void;
  accessToken: string | undefined;
  userInfo: any | null;
}

// Initialize the AuthContext with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to access the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const initializing = useRef(true);
  const accessToken = useRef<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userInfo, setUserInfo] = useState<{ email: string } | null>(null);

  // Function to decode JWT and extract expiration time
  function getTokenExpirationTime(token: string): number {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  }

  useEffect(() => {
    const hash = new URLSearchParams(location.search.slice(1));
    // console.log(location)
    const code = hash.get("code");
    const state = hash.get("state");

    // console.log("Code:", code, "State:", state); // Debugging log

    if (code && state) {
      callback(code, state);
    }

    if (initializing.current) {
      initializing.current = false;
      auth();
    }
  }, []);

  async function auth() {
    const token = await getToken();
    // console.log("Token in auth:", token); // Check if the token is being retrieved
    // setIsAuthenticating(false);

    if (token) {
      accessToken.current = token;
      // Decode the token and set user info (e.g., email)
      await user();
    }
    setIsAuthenticating(false);
  }

  async function getToken() {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) {
      console.log("AuthContext: No refresh token found in localStorage");
      return;
    }

    // If accessToken.current is undefined, try to retrieve from localStorage
    if (!accessToken.current) {
      accessToken.current = localStorage.getItem("access_token") || undefined;
      // console.log("Access token from localStorage:", accessToken.current); // Debugging log
    }

    // If the access token is present, check if it's expired
    if (accessToken.current && isTokenExpired(accessToken.current)) {
      console.log("AuthContext: Token expired, refreshing...");
      const next = await client.refresh(refresh, {
        access: accessToken.current,
      });

      if (next.err) {
        console.error("Error refreshing token:", next.err);
        return;
      }

      if (next.tokens) {
        localStorage.setItem("refresh_token", next.tokens.refresh);
        localStorage.setItem("access_token", next.tokens.access); // Ensure the access token is saved to localStorage
        accessToken.current = next.tokens.access;
        console.log("AuthContext: New access token:", next.tokens.access); // Debugging log
        return next.tokens.access;
      }
    }

    console.log("AuthContext: Returning access token:", accessToken.current); // Debugging log
    return accessToken.current;
  }

  function isTokenExpired(token: string): boolean {
    const expirationTime = getTokenExpirationTime(token);
    return Date.now() > expirationTime;
  }

  async function login() {
    const token = await getToken();
    if (!token) {
      const { challenge, url } = await client.authorize(
        location.origin + "/callback",
        "code",
        {
          pkce: true,
        }
      );
      sessionStorage.setItem("challenge", JSON.stringify(challenge));
      location.href = url;
    }
  }

  async function callback(code: string, state: string) {
    const challenge = JSON.parse(sessionStorage.getItem("challenge")!);

    // console.log("Challenge:", challenge); // Debugging log

    if (code) {
      if (state === challenge.state && challenge.verifier) {
        const exchanged = await client.exchange(
          code!,
          location.origin + "/callback",
          challenge.verifier
        );

        console.log("Exchanged Tokens:", exchanged); // Debugging log

        if (!exchanged.err && exchanged.tokens) {
          localStorage.setItem("access_token", exchanged.tokens.access);
          localStorage.setItem("refresh_token", exchanged.tokens.refresh);

          // Set accessToken.current immediately after saving
          accessToken.current = exchanged.tokens.access;

          console.log("Tokens saved to localStorage:", exchanged.tokens.access); // Debugging log
          await user();
        } else {
          console.error("Error exchanging tokens:", exchanged.err); // Error handling
        }
      }
    }
  }

  async function user() {
    // Decode the JWT directly to extract user information
    if (accessToken.current) {
      try {
        const decoded: any = jwtDecode(accessToken.current); // Decode JWT
        setUserInfo(decoded); // Set user info with decoded data
        setUserId(decoded.sub); // Set user ID (or whatever field represents the user ID)
      } catch (error) {
        console.error("Error decoding token:", error); // Error handling
      }
    }
  }

  function logout() {
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    accessToken.current = undefined;
    setUserInfo(null);
    window.location.replace("/login");
  }

  const value: AuthContextType = {
    isAuthenticating,
    userId,
    login,
    logout,
    accessToken: accessToken.current,
    userInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
