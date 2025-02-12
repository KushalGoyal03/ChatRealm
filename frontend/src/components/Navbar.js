import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data
    navigate("/"); // Redirect to home
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo Image */}
        <Box
          component="img"
          src="/logo.png" // Make sure this matches the filename in /public folder
          alt="ChatSphere Logo"
          sx={{ height: 40, width: 40, mr: 1, borderRadius: "50%" }}
        />

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <strong>ChatSphere</strong>
        </Typography>

        {/* Home button on Login & Register pages */}
        {(location.pathname === "/login" ||
          location.pathname === "/register") && (
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        )}

        {/* Register button on Login page */}
        {location.pathname === "/login" && (
          <Button color="inherit" component={Link} to="/register">
            Sign up
          </Button>
        )}

        {/* Login button on Register page */}
        {location.pathname === "/register" && (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}

        {/* Logout button on Chat page */}
        {location.pathname === "/chat" && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}

        {/* Login & Register buttons on Home page */}
        {location.pathname === "/" && (
          // <>
          //   <Button color="inherit" component={Link} to="/register">
          //     Sign up
          //   </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          // </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
