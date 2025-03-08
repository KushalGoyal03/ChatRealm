import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "text.primary",
        textAlign: "center",
        padding: "1.2rem 0",
        position: "fixed",
        bottom: 0,
        left: 0, // Ensures it starts from the left
        right: 0, // Ensures it stretches to the right
        width: "100vw", // Forces full viewport width
      }}
    >
      <Typography variant="body2">
        <strong> © 2025 ChatSphere. All rights reserved.</strong>
      </Typography>
    </Box>
  );
};

export default Footer;
