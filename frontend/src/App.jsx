import { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./helpers/theme";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/chat/Navbar";
import Footer from "./components/chat/Footer";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!sessionStorage.getItem("token"));
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {!isLoggedIn ? (
          <Routes>
            <Route
              path="/home"
              element={<Home setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        ) : (
          <>
            <Navbar setIsLoggedIn={setIsLoggedIn} />
            <Routes>
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<Navigate to="/chat" />} />
            </Routes>
            <Footer />
          </>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
