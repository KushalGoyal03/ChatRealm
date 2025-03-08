import { useState } from "react";
import { Box } from "@mui/material";
import Login from "../components/Login";
import Register from "../components/Register";

const Home = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Box display="flex" height="100vh" width="100vw">
      {/* Left 65% - Image Section */}
      <Box
        flex="6.5"
        sx={{
          backgroundImage: 'url("/images/background512.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Right 35% - Auth Form Section */}
      <Box
        flex="3.5"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#f0f8ff",
          boxShadow: "-4px 0px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        {showLogin ? (
          <Login toggleForm={() => setShowLogin(false)} />
        ) : (
          <Register toggleForm={() => setShowLogin(true)} />
        )}
      </Box>
    </Box>
  );
};

export default Home;
