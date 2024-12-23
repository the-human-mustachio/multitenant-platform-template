import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import UserComponent from "./UserComponent";

const Header: React.FC = () => {
  const { accessToken, login } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Logo
        </Typography>
        {accessToken ? (
          <Box display="flex" alignItems="center">
            <UserComponent />
            {/* <Button color="inherit" onClick={logout} sx={{ marginLeft: "10px" }}>
              Logout
            </Button> */}
          </Box>
        ) : (
          <Button color="inherit" onClick={login}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
