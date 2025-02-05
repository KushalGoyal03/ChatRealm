import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(""); // Reset error message before attempting login

    // Placeholder for login API call
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Redirect to chat page or home page after successful login
        navigate("/chat"); // Assuming chat page exists
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
    <Container maxWidth="xs" sx={{ marginTop: "3rem" }}>
      <Box textAlign="center" mt={5}>
        <Typography variant="h5" sx={{ color: "secondary.main" }}>
          Login
        </Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            input: { color: "text.primary" },
            "& .MuiInputLabel-root": {
              color: "text.secondary", // Label color
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "gray", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "secondary.main", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.main", // Border color when focused
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "text.secondary", // Placeholder color
            },
            "& .MuiInputBase-input::placeholder:hover": {
              color: "text.secondary", // Placeholder color
            },
          }}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            input: { color: "text.primary" },
            "& .MuiInputLabel-root": {
              color: "text.secondary", // Label color
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "gray", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "secondary.main", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.main", // Border color when focused
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "text.secondary", // Placeholder color
            },
            "& .MuiInputBase-input::placeholder:hover": {
              color: "text.secondary", // Placeholder color
            },
          }}
          InputProps={{
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
        {errorMessage && (
          <Typography variant="body2" sx={{ mt: 2, color: "error.main" }}>
            {errorMessage}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2, color: "text.primary" }}>
          Not registered?{" "}
          <Link
            to="/register"
            style={{ color: "green", textDecoration: "none" }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
