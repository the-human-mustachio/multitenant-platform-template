// SidebarItem.tsx
import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  isSmallScreen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  collapsed,
  isSmallScreen,
}) => {
  const location = useLocation();
  const theme = useTheme();

  // Helper function to determine if the route is selected
  const isSelected = (path: string) => location.pathname === path;

  return (
    <ListItem disablePadding sx={{ height: "50px" }}>
      <ListItemButton
        component={Link}
        to={to}
        sx={{
          backgroundColor: isSelected(to)
            ? theme.palette.action.selected
            : "transparent",
          color: isSelected(to)
            ? theme.palette.primary.contrastText
            : "inherit",
          "& .MuiListItemIcon-root": {
            color: isSelected(to)
              ? theme.palette.primary.contrastText
              : "inherit",
          },
          "&:hover": {
            backgroundColor: isSelected(to)
              ? theme.palette.action.selected
              : theme.palette.action.hover,
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={collapsed || isSmallScreen ? "" : label} />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarItem;
