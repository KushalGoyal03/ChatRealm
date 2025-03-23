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
        left: 0,
        right: 0,
        width: "100vw",
        boxShadow: "0px -4px 20px rgba(0, 150, 255, 0.5)",
      }}
    >
      <Typography variant="body2">
        <strong> © 2025 ChatSphere. All rights reserved.</strong>
      </Typography>
    </Box>
  );
};

export default Footer;
