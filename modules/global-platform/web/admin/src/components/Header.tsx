import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  padding:"10px",
//   color: 'white',
  '&.active': {
    // color: 'primary',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
}));

// In the Header component
<StyledNavLink to="/users">User Table</StyledNavLink>

const Header: React.FC = () => {
  return (
    <AppBar position="fixed" color="black">
      <Toolbar>
        {/* Left Section: Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Platform Admin Application
        </Typography>

        {/* Navigation Links */}
        <Box>
          <StyledNavLink component={Link} to="/">
            Home
          </StyledNavLink>
          <StyledNavLink color='secondary' to="/users">User Table</StyledNavLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
