/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import API_ENDPOINTS from "../helpers/constants";

const Navbar = ({ setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const token = sessionStorage.getItem("token"); // Get token from sessionStorage
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.PROFILE, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsername(data.username);
        } else {
          console.error("Error fetching username:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Remove token
    setIsLoggedIn(false); // Update state in App.js
    navigate("/login"); // Redirect to login
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    alert("This section is under construction.");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ bgcolor: "primary.main", width: "100vw", top: 0 }}
      >
        <Toolbar>
          {/* Logo */}
          <Box
            component="img"
            src="/images/logo.png"
            alt="ChatSphere Logo"
            sx={{ height: 40, width: 40, mr: 1, borderRadius: "50%" }}
          />

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <strong>ChatSphere</strong>
          </Typography>

          {/* Profile Icon and Menu */}
          {location.pathname === "/chat" && (
            <>
              <IconButton
                color="inherit"
                onClick={handleProfileClick}
                disableRipple
                sx={{
                  fontSize: 32,
                  border: "2px solid transparent", // Ensures a smooth look
                  borderRadius: "50%", // Makes it a perfect circle
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: "2px solid rgba(255, 255, 255, 0.5)", // Subtle hover effect
                    bgcolor: "rgba(255, 255, 255, 0.1)", // Light hover background
                  },
                  "&:active": {
                    border: "2px solid rgba(255, 255, 255, 0.8)", // Active state border
                  },
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 32 }} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => {
                  handleMenuClose();
                  setTimeout(() => anchorEl?.blur(), 0);
                }}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: "10px", // Rounded corners
                    border: "2px solid #1976d2", // Custom border color
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)", // Soft shadow
                    minWidth: "200px",
                  },
                  "& .MuiPaper-root:hover": {
                    borderColor: "secondary.main", // Changes border to red on hover
                  },
                }}
              >
                <MenuItem
                  disabled
                  sx={{
                    fontWeight: "bold",
                    //justifyContent: "center",
                    color: "secondary.main", // Darker text for readability
                    "&.Mui-disabled": {
                      opacity: 1, // Ensures text is fully visible even when disabled
                    },
                    display: "flex", // Ensures alignment
                    alignItems: "center",
                    gap: 1, // Space between icon and text
                  }}
                >
                  <AccountCircleIcon
                    sx={{ fontSize: 30, color: "secondary.main" }}
                  />
                  {username || "User"}
                </MenuItem>
                <MenuItem
                  onClick={handleSettingsClick}
                  sx={{
                    "&:hover": {
                      bgcolor: "secondary.main", // Background color on hover
                      color: "primary.main", // Text color on hover
                    },
                  }}
                >
                  <SettingsIcon sx={{ mr: 1 }} />
                  Settings
                </MenuItem>

                <MenuItem
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    color: "secondary.main",
                    "&:hover": {
                      bgcolor: "secondary.main", // Background color on hover
                      color: "primary.main", // Text color on hover
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "8px",
            bgcolor: "background.default",
            padding: "16px",
            minWidth: "320px",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <WarningAmberIcon
              sx={{ color: "warning.main", fontSize: 40, mb: 1 }}
            />
            <Typography component="span" variant="h6">
              Confirm Logout
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", color: "text.secondary" }}>
          Are you sure you want to logout?
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            color="secondary"
            sx={{ width: "100px", borderRadius: "20px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{
              width: "100px",
              borderRadius: "20px",
              bgcolor: "error.main",
              "&:hover": { bgcolor: "error.dark" },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
