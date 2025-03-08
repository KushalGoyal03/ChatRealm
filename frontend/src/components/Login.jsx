/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
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
import { isValidEmail } from "../utils/validateEmail";
import API_ENDPOINTS from "../helpers/constants";

const Login = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        sessionStorage.setItem("token", data.token);
        window.location.href = "/chat"; // Navigate to chat
      } else {
        setErrorMessage(data.message || "Login failed. Try again.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        src="/images/logo.png"
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

      {/* Switch to Register */}
      <Typography
        variant="body2"
        sx={{ mt: 2, color: "primary.main", cursor: "pointer" }}
        onClick={toggleForm}
      >
        Don&#39;t have an account? <strong>Sign up here</strong>
      </Typography>
    </Box>
  );
};

export default Login;
