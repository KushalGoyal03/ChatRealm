import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0A192F" }, // Dark Navy Blue (for Navbar & Buttons)
    secondary: { main: "#64FFDA" }, // Neon Cyan (for Highlights)
    background: { default: "#1C2541", paper: "#0B132B" }, // Deep Blue Background
    text: { primary: "#E0E1DD", secondary: "#64FFDA" }, // Light Text for Readability
  },
  typography: {
    fontFamily: "'Roboto Mono', monospace", // Modern Console-Like Font
    h6: { color: "#64FFDA" }, // Neon Header Text
    body1: { color: "#E0E1DD" }, // Standard Light Text
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0A192F", // Dark Navbar
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "#1C2541", // Dark Background for Containers
          //minHeight: "90vh", // Ensures Full Page Layout
          padding: "20px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#64FFDA", color: "#0A192F" }, // Hover Effect
        },
      },
    },
  },
});

export default theme;
