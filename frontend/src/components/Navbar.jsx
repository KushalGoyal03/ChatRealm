/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const Navbar = ({ setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
          {/* Logo Image */}
          <Box
            component="img"
            src="/images/logo.png"
            alt="ChatSphere Logo"
            sx={{ height: 40, width: 40, mr: 1, borderRadius: "50%" }}
          />

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <strong>ChatSphere</strong>
          </Typography>

          {/* Logout button with confirmation */}
          {location.pathname === "/chat" && (
            <Button
              color="inherit"
              onClick={() => setOpen(true)}
              startIcon={<LogoutIcon />}
              sx={{
                bgcolor: "secondary.main",
                color: "primary.main",
                "&:hover": { bgcolor: "secondary.dark" },
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "8px",
            bgcolor: "background.default", // Light theme background
            padding: "16px",
            minWidth: "320px",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          <WarningAmberIcon
            sx={{ color: "warning.main", fontSize: 40, mb: 1 }}
          />
          <Typography variant="h6">Confirm Logout</Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", color: "text.secondary" }}>
          Are you sure you want to logout?
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
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
