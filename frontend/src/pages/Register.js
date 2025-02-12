import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
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
    <Container maxWidth="xs">
      <Box textAlign="center" mt={8}>
        <Typography
          variant="h5"
          sx={{ color: "secondary.main", fontWeight: "bold" }}
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
            input: { color: "text.primary" }, // Text color inside the input
            "& .MuiInputLabel-root": {
              color: "text.secondary", // Default label color
              //transition: "color 0.3s ease-in-out",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "white", // Floating label color when focused
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
              color: "text.secondary", // Default placeholder color
              //transition: "color 0.3s ease-in-out",
            },
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0px 1000px transparent inset !important",
              WebkitTextFillColor: "white !important", // Force text color for autofill
              //transition: "background-color 5000s ease-in-out 0s", // Prevent autofill background color change
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
            input: { color: "text.primary" }, // Text color inside the input
            "& .MuiInputLabel-root": {
              color: "text.secondary", // Default label color
              //transition: "color 0.3s ease-in-out",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "white", // Floating label color when focused
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
              color: "text.secondary", // Default placeholder color
              //transition: "color 0.3s ease-in-out",
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
            input: { color: "text.primary" }, // Text color inside the input
            "& .MuiInputLabel-root": {
              color: "text.secondary", // Default label color
              //transition: "color 0.3s ease-in-out",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "white", // Floating label color when focused
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
              color: "text.secondary", // Default placeholder color
              //transition: "color 0.3s ease-in-out",
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
            "Sign up"
          )}
        </Button>
        {errorMessage && (
          <Typography variant="body2" sx={{ mt: 2, color: "error.main" }}>
            {errorMessage}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2, color: "text.primary" }}>
          <strong>Already registered?</strong>{" "}
          <Link to="/login" style={{ color: "aqua", textDecoration: "none" }}>
            Sign in here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
