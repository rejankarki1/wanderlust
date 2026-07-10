import { Box, Button, Divider, Menu, MenuItem, Stack, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

export default function NavbarAccountMenu({
  user,
  anchorEl,
  onClose,
  onNavigate,
  onLogout,
  displayName,
  username,
}) {
  return (
    <Menu
      id="account-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          mt: 1.2,
          minWidth: user ? 240 : 184,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.16)",
        },
      }}
    >
      {user ? (
        <Box>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography fontWeight={900}>{displayName}</Typography>
            <Typography variant="body2" color="text.secondary">@{username}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={onNavigate("/dashboard")}><DashboardIcon fontSize="small" sx={{ mr: 1 }} /> Dashboard</MenuItem>
          <MenuItem onClick={onNavigate("/dashboard#my-listings")}><HomeWorkIcon fontSize="small" sx={{ mr: 1 }} /> My Listings</MenuItem>
          <MenuItem onClick={onNavigate("/wishlist")}><FavoriteIcon fontSize="small" sx={{ mr: 1 }} /> Wishlist</MenuItem>
          <MenuItem onClick={onNavigate("/dashboard#profile")}><PersonIcon fontSize="small" sx={{ mr: 1 }} /> Profile & Settings</MenuItem>
          <Divider />
          <MenuItem onClick={onLogout} sx={{ color: "error.main", fontWeight: 800 }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Box>
      ) : (
        <Box sx={{ p: 1 }}>
          <Stack spacing={0.75}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PersonAddAltIcon />}
              onClick={onNavigate("/signup")}
              sx={{ justifyContent: "flex-start", px: 1.6, py: 0.9 }}
            >
              Signup
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<LoginIcon />}
              onClick={onNavigate("/login")}
              sx={{ justifyContent: "flex-start", px: 1.6, py: 0.9 }}
            >
              Login
            </Button>
          </Stack>
        </Box>
      )}
    </Menu>
  );
}
