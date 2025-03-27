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
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const Navbar = ({ setIsLoggedIn }) => {
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
        sx={{
          bgcolor: "primary.main",
          width: "100vw",
          top: 0,
          borderBottom: "4px solid", // Solid Border
          borderImage: "linear-gradient(90deg, #00FFFF, #FF00FF)", // Neon Gradient
          borderImageSlice: 1, // Ensures full gradient is applied
          borderRadius: "10px 10px 0 0",
          boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.8)", // Soft Glow Effect
          animation: "neon-glow 3s linear infinite", // Apply Animation
          "@keyframes neon-glow": {
            "0%": { boxShadow: "0px 0px 10px #00FFFF" },
            "50%": { boxShadow: "0px 0px 20px #FF00FF" },
          },
        }}
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
            <Button
              onClick={() => setOpenDialog(true)}
              startIcon={<LogoutIcon />}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: "20px",
                fontWeight: 500,
                transition: "all 0.3s ease",
                bgcolor: "secondary.main",
                color: "primary.main",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "white",
                  fontWeight: 800,
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Logout
            </Button>
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
