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
        borderTop: "4px solid", // Solid Border
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
      <Typography variant="body2">
        <strong> © 2025 ChatSphere. All rights reserved.</strong>
      </Typography>
    </Box>
  );
};

export default Footer;
