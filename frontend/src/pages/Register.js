import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  PersonOutline,
  LockOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { isValidEmail } from "../utils/validateEmail";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false); // Snackbar state

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccessMessage(true); // Show success Snackbar
        setTimeout(() => {
          navigate("/login"); // Redirect after success message
        }, 2000);
      } else {
        setErrorMessage(data.message || "Registration failed. Try again.");
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

      {/* Right 35% - Register Form Section */}
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
        <Box
          textAlign="center"
          sx={{
            width: "80%",
            marginTop: "-50px",
            input: { color: "primary.main" },
            "& .MuiInputLabel-root": { color: "primary.main" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "primary.main" },
              "&:hover fieldset": {
                borderColor: "primary.main",
                borderWidth: "2px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
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
            Join ChatSphere
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

          {/* Username Input */}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline color="primary" />
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

          {/* Register Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegister}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "secondary.main" }} />
            ) : (
              "Sign Up"
            )}
          </Button>

          {/* Error Message */}
          {errorMessage && (
            <Typography variant="body2" sx={{ mt: 2, color: "error.main" }}>
              {errorMessage}
            </Typography>
          )}

          {/* Sign In Link */}
          <Typography variant="body2" sx={{ mt: 2, color: "primary.main" }}>
            <strong>Already registered?</strong>{" "}
            <Link to="/login" style={{ textDecoration: "none" }}>
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessMessage(false)}
          sx={{ width: "100%" }}
        >
          Registration successful! Redirecting to login...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
