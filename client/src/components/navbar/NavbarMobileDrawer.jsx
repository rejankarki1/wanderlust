import { Link as RouterLink } from "react-router-dom";
import { Box, Divider, Drawer, MenuItem, Stack, Typography } from "@mui/material";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExploreIcon from "@mui/icons-material/Explore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

export default function NavbarMobileDrawer({ open, user, onClose, onLogout }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2.5 }} role="presentation">
        <Stack spacing={1}>
          <Stack direction="row" spacing={1.1} alignItems="center" sx={{ color: "primary.main", mb: 1 }}>
            <TravelExploreIcon color="primary" sx={{ fontSize: 30 }} />
            <Typography variant="h6" fontWeight={900}>Wanderlust</Typography>
          </Stack>
          <Divider />
          <MenuItem component={RouterLink} to="/listings" onClick={onClose}><HomeWorkIcon fontSize="small" sx={{ mr: 1 }} /> Homes</MenuItem>
          <MenuItem component={RouterLink} to="/listings?category=Trending" onClick={onClose}><ExploreIcon fontSize="small" sx={{ mr: 1 }} /> Experiences</MenuItem>
          <MenuItem component={RouterLink} to="/listings?category=Rooms" onClick={onClose}><RoomServiceIcon fontSize="small" sx={{ mr: 1 }} /> Services</MenuItem>
          <Divider />
          {user && <MenuItem component={RouterLink} to="/dashboard" onClick={onClose}><DashboardIcon fontSize="small" sx={{ mr: 1 }} /> Dashboard</MenuItem>}
          <MenuItem component={RouterLink} to="/listings/new" onClick={onClose}><AddHomeWorkIcon fontSize="small" sx={{ mr: 1 }} /> Add Listing</MenuItem>
          {user && <MenuItem component={RouterLink} to="/wishlist" onClick={onClose}><FavoriteIcon fontSize="small" sx={{ mr: 1 }} /> Wishlist</MenuItem>}
          {user && <MenuItem component={RouterLink} to="/dashboard#profile" onClick={onClose}><PersonIcon fontSize="small" sx={{ mr: 1 }} /> Profile</MenuItem>}
          {!user && <MenuItem component={RouterLink} to="/login" onClick={onClose}>Login</MenuItem>}
          {!user && <MenuItem component={RouterLink} to="/signup" onClick={onClose}>Signup</MenuItem>}
          {user && (
            <>
              <Divider />
              <MenuItem onClick={onLogout} sx={{ color: "error.main", fontWeight: 800 }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}
