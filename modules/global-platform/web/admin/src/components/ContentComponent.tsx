import React, { ReactNode } from "react";
import { Box, Toolbar } from "@mui/material";

interface ContentProps {
  children?: ReactNode;
  drawerWidth: number;
}

const Content: React.FC<ContentProps> = ({ children, drawerWidth }) => (
  <Box
    sx={{
      flexGrow: 1,
      padding: 2,
      //   marginLeft: `${drawerWidth}px`,
      marginTop: "50px",
    }}
  >
    {/* <Toolbar /> Space for header */}
    {children}
  </Box>
);

export default Content;
