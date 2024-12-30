import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Box, CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import AuthComponent from "./components/auth/AuthComponent";
import ProtectedRoute from "./components/ProtectedRouteComponent";
import LoginPage from "./pages/LoginPage";
import CallbackHandler from "./components/auth/CallbackHandlerComponent";
import Sidebar from "./components/sidebar/SidebarComponent";
import Content from "./components/ContentComponent";
import HomePage from "./pages/HomePage";

// Sidebar width
const drawerWidth = 200;

// Define the custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue color for primary
      contrastText: "#fafafa", // White text color
    },
    secondary: {
      main: "#ff4081", // Pink color for secondary
    },
    background: {
      default: "#fafafa", // Light background color
    },
    text: {
      primary: "#333", // Dark text color
      secondary: "#777", // Lighter text color
    },
    action: {
      selected: "#1976d2", // Highlight selected items with yellow
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply default MUI styles */}
      <AuthComponent />
      <Router>
        <Box sx={{ display: "flex" }}>
          <Sidebar drawerWidth={drawerWidth} />
          <Content drawerWidth={drawerWidth}>
            <Box sx={{ display: "flex" }}>
              <Routes>
                {/* Callback Route */}
                <Route path="/callback" element={<CallbackHandler />} />
                {/* Login Route - Public */}
                <Route path="/login" element={<LoginPage />} />
                {/* Protected Routes - Only accessible when authenticated */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <HomePage /> {/* This is the protected page */}
                    </ProtectedRoute>
                  }
                />
                {/* Add other protected routes here */}
                {/* Catch-all Route for any unrecognized paths */}
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </Box>
          </Content>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
