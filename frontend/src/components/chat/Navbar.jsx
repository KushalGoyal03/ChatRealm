/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const Navbar = ({ setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Remove token
    setIsLoggedIn(false); // Update state in App.js
    navigate("/login"); // Redirect to login
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

          {/* Logout Button */}
          {location.pathname === "/chat" && (
            <IconButton
              color="inherit"
              onClick={() => setOpenDialog(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1, // Adds spacing between icon and text
                px: 2, // Adds horizontal padding
                py: 1, // Adds vertical padding
                borderRadius: "20px", // Rounded button
                transition: "all 0.3s ease",
                bgcolor: "secondary.main",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)", // Subtle background highlight on hover
                  color: "primary.main", // Soft color change on hover
                },
              }}
            >
              <LogoutIcon sx={{ fontSize: 28 }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Logout
              </Typography>
            </IconButton>
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
