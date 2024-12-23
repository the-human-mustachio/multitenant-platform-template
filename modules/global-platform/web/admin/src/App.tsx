import AuthComponent from "./components/AuthComponent";
import ProtectedRoute from "./components/ProtectedRouteComponent";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProtectedInfo from "./pages/ProtectedInfo";
import LoginPage from "./pages/LoginPage";
import CallbackHandler from "./components/CallbackHandlerComponent";

const App = () => {
  return (
    // <AuthProvider>
    <>
      <AuthComponent />
      <Router>
        <Routes>
          {/* Login Route - Public */}
          {/* <Route path="/code" element={<CallbackHandler />} /> */}
          <Route path="/callback" element={<CallbackHandler />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected Routes - Only accessible when authenticated */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <ProtectedInfo /> {/* This is the protected page */}
              </ProtectedRoute>
            }
          />

          {/* Add other protected routes here */}
          {/* Catch-all Route for any unrecognized paths */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
