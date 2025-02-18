import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login API Response:", data); // ✅ Debugging

      if (response.status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true); // ✅ Update auth state
        navigate("/chat"); // Redirect to chat page
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" height="100vh" width="100vw">
      {/* Left 65% - Image Section */}
      <Box
        flex="6.5"
        sx={{
          backgroundImage: 'url("/background512.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Right 35% - Login Form Section */}
      <Box
        flex="3.5"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#f0f8ff", // Light blue background
          boxShadow: "-4px 0px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          textAlign="center"
          sx={{
            width: "80%",
            marginTop: "-100px",
            input: { color: "primary.main" }, // Text color inside the input
            "& .MuiInputLabel-root": { color: "primary.main" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "primary.main" },
              "&:hover fieldset": {
                borderColor: "primary.main", // Border color on hover
                borderWidth: "2px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main", // Border color on hover
                borderWidth: "2px",
              },
            },
          }}
        >
          {/* Logo */}
          <img
            src="/logo.png"
            alt="ChatSphere Logo"
            style={{
              width: "60px",
              height: "auto",
              marginBottom: "10px",
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="h4"
            sx={{ color: "primary.main", fontWeight: "bold", mb: 2 }}
          >
            Welcome to ChatSphere
          </Typography>

          {/* Email Input */}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {/* Password Input */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Login Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "secondary.main" }} />
            ) : (
              "Login"
            )}
          </Button>

          {/* Error Message */}
          {errorMessage && (
            <Typography variant="body2" sx={{ mt: 2, color: "error.main" }}>
              {errorMessage}
            </Typography>
          )}

          {/* Sign Up Link */}
          <Typography variant="body2" sx={{ mt: 2, color: "primary.main" }}>
            <strong>Not registered?</strong>{" "}
            <Link to="/register" style={{ textDecoration: "none" }}>
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
