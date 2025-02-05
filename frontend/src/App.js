import React from "react";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import theme from "./components/theme"; // Import the theme
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets Styles */}
      <Router>
        <Navbar />
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: "background.default",
            //minHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            //paddingTop: "20px",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
