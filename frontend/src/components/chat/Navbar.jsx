import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState("User");

  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username || "User");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.reload();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <AppBar position="fixed" className="appBar" elevation={0}>
        <Toolbar className="toolbar">
          <div className="logoContainer">
            <Typography variant="h6" className="title">
              <strong>ChatRealm</strong>
            </Typography>
          </div>

          {location.pathname === "/chat" && (
            <div className="navRightControls">
              <IconButton onClick={handleMenuClick}>
                <Avatar sx={{ bgcolor: "#1976d2", width: 36, height: 36 }}>
                  {getInitial(username)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem disabled>
                  <ListItemText primary={username} />
                </MenuItem>

                <Divider className="customDivider" />

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    setOpenDialog(true);
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon className="customIcon" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        classes={{ paper: "dialogPaper" }}
      >
        <DialogTitle>
          <div className="dialogTitleBox">
            <WarningAmberIcon className="warningIcon" />
            <Typography component="span" variant="h6">
              Confirm Logout
            </Typography>
          </div>
        </DialogTitle>

        <DialogContent className="dialogContent">
          Are you sure you want to logout?
        </DialogContent>

        <DialogActions className="dialogActions">
          <Button onClick={() => setOpenDialog(false)} className="buttonCancel">
            Cancel
          </Button>
          <Button onClick={handleLogout} className="buttonLogout">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
