import { useEffect, useState } from "react";
import { Link as RouterLink, NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import ExploreIcon from "@mui/icons-material/Explore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useAuth } from "../context/AuthContext.jsx";
import { useFlash } from "../context/FlashContext.jsx";
import SearchBar from "./SearchBar.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showFlash } = useFlash();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => {
      const scrollY = window.scrollY;

      setScrolled((current) => {
        if (!current && scrollY > 120) {
          return true;
        }

        if (current && scrollY < 32) {
          return false;
        }

        return current;
      });
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  const handleLogout = async () => {
    await logout();
    showFlash("success", "Logged you out.");
    navigate("/listings");
  };

  const closeMenu = () => setMenuAnchor(null);

  const navLinkStyle = ({ isActive }) => ({
    color: "inherit",
    fontWeight: isActive ? 800 : 700,
  });

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "box-shadow 180ms ease",
        boxShadow: scrolled ? "0 8px 30px rgba(15, 23, 42, 0.08)" : "none",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          height: { xs: "auto", md: scrolled ? 82 : 170 },
          overflow: "hidden",
          transition: "height 180ms ease",
        }}
      >
        <Toolbar disableGutters sx={{ minHeight: { xs: 72, md: 82 }, gap: 2 }}>
          <Stack component={RouterLink} to="/listings" direction="row" spacing={1.1} alignItems="center" sx={{ color: "primary.main", minWidth: { md: 230 } }}>
            <TravelExploreIcon color="primary" sx={{ fontSize: 34 }} />
            <Typography variant="h6" fontWeight={900} sx={{ display: { xs: "none", sm: "block" } }}>
              Wanderlust
            </Typography>
          </Stack>

          <Box
            sx={{
              flex: 1,
              alignSelf: "stretch",
              position: "relative",
              display: { xs: "none", md: "block" },
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              spacing={4.2}
              alignItems="center"
              justifyContent="center"
              sx={{
                position: "absolute",
                inset: 0,
                opacity: scrolled ? 0 : 1,
                transform: scrolled ? "translateY(-18px) scale(0.96)" : "translateY(0) scale(1)",
                pointerEvents: scrolled ? "none" : "auto",
                visibility: scrolled ? "hidden" : "visible",
                transition: scrolled
                  ? "opacity 90ms ease, transform 120ms ease, visibility 0s linear 90ms"
                  : "opacity 180ms ease 80ms, transform 200ms ease, visibility 0s",
              }}
            >
              <Stack alignItems="center" spacing={0.4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <HomeWorkIcon />
                  <Typography fontWeight={900}>Homes</Typography>
                </Stack>
                <Box sx={{ width: 82, height: 3, bgcolor: "text.primary", borderRadius: 99 }} />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                <ExploreIcon />
                <Typography fontWeight={800}>Experiences</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                <RoomServiceIcon />
                <Typography fontWeight={800}>Services</Typography>
              </Stack>
            </Stack>

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: scrolled ? 1 : 0,
                transform: scrolled ? "translateY(0) scale(1)" : "translateY(14px) scale(0.92)",
                pointerEvents: scrolled ? "auto" : "none",
                visibility: scrolled ? "visible" : "hidden",
                transition: scrolled
                  ? "opacity 160ms ease 80ms, transform 200ms ease, visibility 0s"
                  : "opacity 90ms ease, transform 120ms ease, visibility 0s linear 90ms",
              }}
            >
              <SearchBar variant="compact" />
            </Box>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ minWidth: { md: 230 }, display: { xs: "none", md: "flex" } }}>
            <Button component={RouterLink} to="/listings/new" color="secondary" startIcon={<AddHomeWorkIcon />}>
              Add Listing
            </Button>
            {!user && <NavLink to="/login" style={navLinkStyle}>Login</NavLink>}
            {!user && <Button component={RouterLink} to="/signup" variant="contained">Signup</Button>}
            {user && (
              <Button component={RouterLink} to="/wishlist" color="secondary" startIcon={<FavoriteIcon />}>
                Wishlist
              </Button>
            )}
            {user && <Typography color="text.secondary" fontWeight={800}>@{user.username}</Typography>}
            {user && (
              <Button color="secondary" onClick={handleLogout} startIcon={<LogoutIcon />}>
                Logout
              </Button>
            )}
          </Stack>

          <Tooltip title="Open navigation">
            <IconButton
              onClick={(event) => setMenuAnchor(event.currentTarget)}
              sx={{ display: { xs: "inline-flex", md: "none" }, ml: "auto", bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
            <MenuItem component={RouterLink} to="/listings/new" onClick={closeMenu}>
              <AddHomeWorkIcon fontSize="small" sx={{ mr: 1 }} /> Add Listing
            </MenuItem>
            <Divider />
            {!user && <MenuItem component={RouterLink} to="/login" onClick={closeMenu}>Login</MenuItem>}
            {!user && <MenuItem component={RouterLink} to="/signup" onClick={closeMenu}>Signup</MenuItem>}
            {user && (
              <MenuItem component={RouterLink} to="/wishlist" onClick={closeMenu}>
                <FavoriteIcon fontSize="small" sx={{ mr: 1 }} /> Wishlist
              </MenuItem>
            )}
            {user && <MenuItem disabled>@{user.username}</MenuItem>}
            {user && <MenuItem onClick={() => { closeMenu(); handleLogout(); }}>Logout</MenuItem>}
          </Menu>
        </Toolbar>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            pb: 2.4,
            opacity: scrolled ? 0 : 1,
            transform: scrolled ? "translateY(-28px) scale(0.94)" : "translateY(0) scale(1)",
            pointerEvents: scrolled ? "none" : "auto",
            visibility: scrolled ? "hidden" : "visible",
            transition: scrolled
              ? "opacity 80ms ease, transform 120ms ease, visibility 0s linear 80ms"
              : "opacity 180ms ease 80ms, transform 200ms ease, visibility 0s",
          }}
        >
          <SearchBar variant="expanded" />
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" }, pb: 1.6 }}>
          <SearchBar variant="mobile" />
        </Box>
      </Container>
    </AppBar>
  );
}
