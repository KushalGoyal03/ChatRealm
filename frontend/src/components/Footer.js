import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "text.primary",
        textAlign: "center",
        padding: "20px 0",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2">
        <strong> © 2025 ChatSphere. All rights reserved.</strong>
      </Typography>
    </Box>
  );
};

export default Footer;
