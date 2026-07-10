import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Divider, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useAuth } from "../context/AuthContext.jsx";
import { useFlash } from "../context/FlashContext.jsx";
import PasswordField from "../components/PasswordField.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const { showFlash } = useFlash();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      await login({
        username: formData.get("username"),
        password: formData.get("password"),
      });
      showFlash("success", "Welcome back to Wanderlust.");
      navigate(location.state?.from?.pathname || "/listings");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 940, mx: "auto", py: { xs: 1, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "0.9fr 1fr" },
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 5,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 520,
            p: 4,
            color: "white",
            background:
              "linear-gradient(145deg, rgba(254,66,77,0.94), rgba(31,41,55,0.92)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80') center/cover",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <TravelExploreIcon />
            <Typography variant="h5" fontWeight={900}>Wanderlust</Typography>
          </Stack>
          <Box>
            <Typography variant="h3" sx={{ color: "inherit", mb: 1 }}>
              Welcome back.
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", maxWidth: 320 }}>
              Manage listings, reviews, and your next stay from one place.
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h3">Login</Typography>
              <Typography color="text.secondary">Use your Wanderlust account to continue.</Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField name="username" label="Username" required fullWidth autoComplete="username" />
            <PasswordField name="password" label="Password" required fullWidth autoComplete="current-password" />
            <Button type="submit" variant="contained" size="large" startIcon={<LoginIcon />} sx={{ py: 1.45 }}>
              Login
            </Button>
            <Divider>or</Divider>
            <Button
              component="a"
              href="/api/auth/google"
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              sx={{ py: 1.45 }}
            >
              Continue with Google
            </Button>
            <Typography color="text.secondary" textAlign="center">
              New here?{" "}
              <Link component={RouterLink} to="/signup" fontWeight={800} underline="hover">
                Create an account
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
