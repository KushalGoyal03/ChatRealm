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
import { isValidEmail } from "../../utils/validateEmail";
import API_ENDPOINTS from "../../helpers/constants";

const Register = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccessMessage(true);
        setTimeout(() => toggleForm(), 2000);
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
        Join ChatSphere
      </Typography>

      {/* Inputs */}
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
              <IconButton onClick={() => setShowPassword(!showPassword)}>
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
        onClick={handleRegister}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Sign Up"}
      </Button>
      {/* Error Message */}
      {errorMessage && (
        <Typography variant="body2" sx={{ mt: 2, color: "error.main" }}>
          {errorMessage}
        </Typography>
      )}

      <Typography
        variant="body2"
        sx={{ mt: 2, color: "primary.main", cursor: "pointer" }}
        onClick={toggleForm}
      >
        Already registered? <strong>Sign in here</strong>
      </Typography>

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
