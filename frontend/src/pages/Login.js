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
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
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
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        navigate("/chat");
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
      {/* Left 60% - Image Section */}
      <Box
        flex="6"
        sx={{
          backgroundImage: 'url("/background512.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Right 40% - Login Form Section */}
      <Box
        flex="4"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#f0f8ff", // Light blue background
          boxShadow: "-4px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container maxWidth="xs">
          <Box textAlign="center">
            {/* Logo */}
            <img
              src="/logo.png" // Update the path if needed
              alt="ChatSphere Logo"
              style={{
                width: "80px",
                height: "auto",
                marginBottom: "10px",
                borderRadius: "50%",
              }}
            />
            <Typography
              variant="h5"
              sx={{ color: "primary.main", fontWeight: "bold", mb: 2 }}
            >
              ChatSphere
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
            <Typography variant="body2" sx={{ mt: 2, color: "text.primary" }}>
              <strong>Not registered?</strong>{" "}
              <Link
                to="/register"
                style={{ color: "aqua", textDecoration: "none" }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;

// import React, { useState } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   IconButton,
//   InputAdornment,
//   CircularProgress,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const navigate = useNavigate(); // Initialize useNavigate for redirection

//   const handleLogin = async () => {
//     setLoading(true);
//     setErrorMessage(""); // Reset error message before attempting login

//     // Placeholder for login API call
//     try {
//       const response = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.status === 200) {
//         // Redirect to chat page or home page after successful login
//         navigate("/chat"); // Assuming chat page exists
//       } else {
//         setErrorMessage(data.message || "Login failed. Please try again.");
//       }
//     } catch (error) {
//       setErrorMessage("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box textAlign="center" mt={10}>
//         <Typography
//           variant="h5"
//           sx={{ color: "secondary.main", fontWeight: "bold" }}
//         >
//           Login
//         </Typography>
//         <TextField
//           label="Email"
//           fullWidth
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           sx={{
//             input: { color: "text.primary" }, // Text color inside the input
//             "& .MuiInputLabel-root": {
//               color: "text.secondary", // Default label color
//               //transition: "color 0.3s ease-in-out",
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "white", // Floating label color when focused
//             },
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": {
//                 borderColor: "gray", // Default border color
//               },
//               "&:hover fieldset": {
//                 borderColor: "secondary.main", // Border color on hover
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "secondary.main", // Border color when focused
//               },
//             },
//             "& .MuiInputBase-input::placeholder": {
//               color: "text.secondary", // Default placeholder color
//               //transition: "color 0.3s ease-in-out",
//             },
//           }}
//         />
//         <TextField
//           label="Password"
//           type={showPassword ? "text" : "password"}
//           fullWidth
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           sx={{
//             input: { color: "text.primary" }, // Text color inside the input
//             "& .MuiInputLabel-root": {
//               color: "text.secondary", // Default label color
//               //transition: "color 0.3s ease-in-out",
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "white", // Floating label color when focused
//             },
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": {
//                 borderColor: "gray", // Default border color
//               },
//               "&:hover fieldset": {
//                 borderColor: "secondary.main", // Border color on hover
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "secondary.main", // Border color when focused
//               },
//             },
//             "& .MuiInputBase-input::placeholder": {
//               color: "text.secondary", // Default placeholder color
//               //transition: "color 0.3s ease-in-out",
//             },
//           }}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   onClick={() => setShowPassword(!showPassword)}
//                   edge="end"
//                 >
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleLogin}
//           sx={{ mt: 2 }}
//           disabled={loading}
//         >
//           {loading ? (
//             <CircularProgress size={24} sx={{ color: "secondary.main" }} />
//           ) : (
//             "Login"
//           )}
//         </Button>
//         {errorMessage && (
//           <Typography variant="body2" sx={{ mt: 2, color: "error.main" }}>
//             {errorMessage}
//           </Typography>
//         )}
//         <Typography variant="body2" sx={{ mt: 2, color: "text.primary" }}>
//           <strong>Not registered?</strong>{" "}
//           <Link
//             to="/register"
//             style={{ color: "aqua", textDecoration: "none" }}
//           >
//             Sign up here
//           </Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default Login;
