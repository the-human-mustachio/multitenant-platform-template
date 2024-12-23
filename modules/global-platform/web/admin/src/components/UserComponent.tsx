import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

const UserComponent: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // console.log(userInfo)
  if (!userInfo) {
    return null; // Don't render if the user is not authenticated
  }

  const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Typography
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          fontWeight: "bold",
          display: "inline-block",
        }}
        role="button"
        tabIndex={0}
      >
        {userInfo.properties.email}
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            logout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserComponent;
