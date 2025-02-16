import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import theme from "./helpers/theme"; // Import the theme
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Listen for login status changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth); // Sync login state across tabs
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
        {/* Show Navbar only if logged in */}
        {/* {isLoggedIn && <Navbar />}  */}
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: "background.default",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: 0,
          }}
        >
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/chat" />
                ) : (
                  <Login setIsLoggedIn={setIsLoggedIn} />
                )
              }
            />
            <Route
              path="/register"
              element={
                isLoggedIn ? (
                  <Navigate to="/chat" />
                ) : (
                  <Register setIsLoggedIn={setIsLoggedIn} />
                )
              }
            />
            <Route
              path="/chat"
              element={isLoggedIn ? <Chat /> : <Navigate to="/login" />}
            />
            <Route
              path="*"
              element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />}
            />
          </Routes>
        </Container>
        {isLoggedIn && <Footer />} {/* Show Footer only if logged in */}
      </Router>
    </ThemeProvider>
  );
};

export default App;
