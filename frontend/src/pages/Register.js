import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { isValidEmail } from "../utils/validateEmail";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Initialize navigate

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        navigate("/login"); // Use navigate to redirect
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: "3rem" }}>
      <Typography
        variant="h5"
        sx={{
          color: "secondary.main",
          mb: 2,
          textAlign: "center",
        }}
      >
        Register
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
        helperText={emailError ? "Please enter a valid email" : ""}
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
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        fullWidth
        onClick={handleRegister}
        sx={{
          mt: 2,
          bgcolor: "primary.main",
          color: "secondary.main",
        }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "secondary.main" }} />
        ) : (
          "Register"
        )}
      </Button>
      {errorMessage && (
        <Typography variant="body2" sx={{ mt: 2, color: "error.main" }}>
          {errorMessage}
        </Typography>
      )}
      <Typography variant="body2" sx={{ mt: 2, color: "text.primary" }}>
        Already registered?{" "}
        <Link to="/login" style={{ color: "green", textDecoration: "none" }}>
          Login here
        </Link>
      </Typography>
    </Container>
  );
};

export default Register;
