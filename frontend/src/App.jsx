import { useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
    <>
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
          <Routes>
            <Route
              path="/chat"
              element={<Chat setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="*" element={<Navigate to="/chat" />} />
          </Routes>
        )}
      </Router>
    </>
  );
};

export default App;
