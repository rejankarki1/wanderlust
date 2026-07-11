import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Divider, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GoogleIcon from "@mui/icons-material/Google";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useAuth } from "../context/AuthContext.jsx";
import { useFlash } from "../context/FlashContext.jsx";
import PasswordField from "../components/PasswordField.jsx";

const getPasswordChecks = (password) => [
  { label: "8+ characters", valid: password.length >= 8 },
  { label: "Lowercase letter", valid: /[a-z]/.test(password) },
  { label: "Uppercase letter", valid: /[A-Z]/.test(password) },
  { label: "Number", valid: /\d/.test(password) },
  { label: "Symbol", valid: /[^A-Za-z0-9]/.test(password) },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const { showFlash } = useFlash();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const passwordChecks = getPasswordChecks(password);
  const passwordStrong = passwordChecks.every((check) => check.valid);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const nextPassword = formData.get("password") || "";

    if (!getPasswordChecks(nextPassword).every((check) => check.valid)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
      return;
    }

    try {
      await signup({
        username: formData.get("username"),
        email: formData.get("email"),
        password: nextPassword,
      });
      showFlash("success", "Welcome to Wanderlust.");
      navigate("/listings");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 980, mx: "auto", py: { xs: 1, md: 3 } }}>
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
            minHeight: 560,
            p: 4,
            color: "white",
            background:
              "linear-gradient(145deg, rgba(254,66,77,0.94), rgba(31,41,55,0.92)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80') center/cover",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <TravelExploreIcon />
            <Typography variant="h5" fontWeight={900}>Wanderlust</Typography>
          </Stack>
          <Box>
            <Typography variant="h3" sx={{ color: "inherit", mb: 1 }}>
              Start hosting.
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", maxWidth: 330 }}>
              Create an account to publish stays, manage reviews, and explore destinations.
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h3">Signup</Typography>
              <Typography color="text.secondary">Create your Wanderlust account.</Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField name="username" label="Username" required fullWidth autoComplete="username" />
            <TextField name="email" label="Email" type="email" required fullWidth autoComplete="email" />
            <PasswordField
              name="password"
              label="Password"
              required
              fullWidth
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Stack spacing={0.8}>
              {passwordChecks.map((check) => (
                <Stack key={check.label} direction="row" spacing={1} alignItems="center">
                  {check.valid ? (
                    <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                  ) : (
                    <RadioButtonUncheckedIcon color="disabled" sx={{ fontSize: 18 }} />
                  )}
                  <Typography variant="body2" color={check.valid ? "success.main" : "text.secondary"}>
                    {check.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Button type="submit" variant="contained" size="large" startIcon={<PersonAddAltIcon />} disabled={password.length > 0 && !passwordStrong} sx={{ py: 1.45 }}>
              Signup
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
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" fontWeight={800} underline="hover">
                Login
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
