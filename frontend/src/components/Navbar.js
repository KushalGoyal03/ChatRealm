import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data
    navigate("/login"); // Redirect to login
  };

  return (
    <AppBar
      position="static"
      color="primary"
      //sx={{ bgcolor: "#1E1E1E" }}
    >
      <Toolbar>
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
            Register
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
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
