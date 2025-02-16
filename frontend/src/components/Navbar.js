import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsLoggedIn(false); // Update state in App.js
    navigate("/login"); // Redirect to login
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

        {/* Logout button on Chat page */}
        {location.pathname === "/chat" && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
