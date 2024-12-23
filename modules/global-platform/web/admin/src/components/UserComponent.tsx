import React, { useState } from "react";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

const UserComponent: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
          fontWeight: "reqular",
          display: "inline-block",
        }}
        role="button"
        tabIndex={0}
      >
        User: {userInfo.properties.email}
        <br />
        Organziation: {userInfo.properties.organizationId}
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left", // Align to the left
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left", // Align to the left
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
