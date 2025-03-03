import { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import theme from "./helpers/theme";
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
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!sessionStorage.getItem("token"));
    };
    // Listen for changes in sessionStorage (not across tabs)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: "background.default",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: 0,
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
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
        {isLoggedIn && <Footer />}
      </Router>
    </ThemeProvider>
  );
};

export default App;
