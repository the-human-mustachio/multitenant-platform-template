// Sidebar.tsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  IconButton,
  useMediaQuery,
  useTheme,
  ListItemButton,
  ListItem,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"; // Collapse icon
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // Expand icon
import HomeIcon from "@mui/icons-material/Home"; // Home icon
import InfoIcon from "@mui/icons-material/Info"; // About icon
import ContactMailIcon from "@mui/icons-material/ContactMail"; // Contact icon
import SidebarItem from "./SidebarItemComponent";

interface SidebarProps {
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth }) => {
  const [collapsed, setCollapsed] = useState(false); // State to toggle the sidebar
  const theme = useTheme();
  const location = useLocation(); // Hook to get current route

  // Use media query to check if the screen size is small (e.g., mobile)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Toggle the sidebar's collapsed state
  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed || isSmallScreen ? 60 : drawerWidth, // Set width based on collapsed state or screen size
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed || isSmallScreen ? 60 : drawerWidth,
          boxSizing: "border-box",
          top: (theme) => theme.mixins.toolbar.minHeight, // Start below the header
          height: `calc(100vh - ${(theme: {
            mixins: { toolbar: { minHeight: any } };
          }) => theme.mixins.toolbar.minHeight}px)`,
        },
      }}
    >
      <List>
        <ListItem disablePadding sx={{ height: "50px" }}>
          <ListItemButton onClick={handleCollapseToggle}>
            <IconButton sx={{ padding: "0" }}>
              {collapsed || isSmallScreen ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </ListItemButton>
        </ListItem>

        {/* Use SidebarItem for each list item */}
        <SidebarItem
          to="/home"
          icon={<HomeIcon />}
          label="Home"
          collapsed={collapsed}
          isSmallScreen={isSmallScreen}
        />
        <SidebarItem
          to="/about"
          icon={<InfoIcon />}
          label="About"
          collapsed={collapsed}
          isSmallScreen={isSmallScreen}
        />
        <SidebarItem
          to="/contact"
          icon={<ContactMailIcon />}
          label="Contact"
          collapsed={collapsed}
          isSmallScreen={isSmallScreen}
        />
      </List>
    </Drawer>
  );
};

export default Sidebar;
