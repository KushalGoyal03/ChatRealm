import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { apiRequest } from "../helpers/apiHelper";
import API_ENDPOINTS from "../constants";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const message = await apiRequest(
        API_ENDPOINTS.REGISTER,
        "POST",
        formData
      );
      alert(message);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Register
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
