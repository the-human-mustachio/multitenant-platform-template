import { useAuth } from "../../auth/AuthContext";
import Header from "../HeaderComponent"; // Material-UI Header component

interface AuthComponentProps {
  header?: React.ReactNode; // Customizable header
}

const AuthComponent: React.FC<AuthComponentProps> = ({ header }) => {
  const { isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  return <div>{header || <Header />}</div>;
};

export default AuthComponent;
