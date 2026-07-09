import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
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
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExploreIcon from "@mui/icons-material/Explore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useAuth } from "../context/AuthContext.jsx";
import { useFlash } from "../context/FlashContext.jsx";
import SearchBar from "./SearchBar.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showFlash } = useFlash();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wishlistCount = user?.wishlist?.length || 0;
  const username = user?.username || "";
  const displayName = username
    ? username
        .split(/[\s._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Guest";
  const initials = username
    ? username
        .split(/[\s._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || username.slice(0, 2).toUpperCase()
    : "U";
  const activeCategory = new URLSearchParams(location.search).get("category") || "";
  const experiencesActive = activeCategory === "Trending";
  const servicesActive = activeCategory === "Rooms";
  const homesActive = !experiencesActive && !servicesActive && (
    ["/", "/listings"].some((path) => location.pathname === path) || location.pathname.startsWith("/listings/")
  );

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
    setUserMenuAnchor(null);
    setMobileDrawerOpen(false);
    await logout();
    showFlash("success", "Logged you out.");
    navigate("/listings");
  };

  const closeUserMenu = () => setUserMenuAnchor(null);
  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  const navItemSx = (active = false) => ({
    position: "relative",
    color: active ? "text.primary" : "text.secondary",
    fontSize: 15,
    fontWeight: active ? 800 : 700,
    px: 1.4,
    py: 1,
    borderRadius: 999,
    textDecoration: "none",
    transition: "color 160ms ease, background-color 160ms ease",
    "&:hover": {
      color: "text.primary",
      bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
    },
    "&::after": {
      content: '""',
      position: "absolute",
      left: 14,
      right: 14,
      bottom: 3,
      height: 2,
      borderRadius: 99,
      bgcolor: active ? "primary.main" : "transparent",
      transition: "background-color 160ms ease",
    },
  });

  const menuNavigate = (to) => () => {
    closeUserMenu();
    closeMobileDrawer();
    navigate(to);
  };

  const wishlistButton = (mobile = false) => (
    <Tooltip title="Wishlist">
      <IconButton
        component={RouterLink}
        to="/wishlist"
        aria-label="Wishlist"
        onClick={mobile ? closeMobileDrawer : undefined}
        sx={{
          width: 42,
          height: 42,
          color: "secondary.main",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
            color: "primary.main",
          },
        }}
      >
        <Badge badgeContent={wishlistCount || null} color="primary" max={99}>
          <FavoriteIcon sx={{ fontSize: 21 }} />
        </Badge>
      </IconButton>
    </Tooltip>
  );

  const avatarButton = (
    <Tooltip title={user ? "Open account menu" : "Account"}>
      <IconButton
        aria-label="Open account menu"
        aria-controls={userMenuAnchor ? "account-menu" : undefined}
        aria-haspopup="menu"
        aria-expanded={userMenuAnchor ? "true" : undefined}
        onClick={(event) => setUserMenuAnchor(event.currentTarget)}
        sx={{
          gap: 0.5,
          borderRadius: 999,
          border: "1px solid",
          borderColor: "divider",
          px: 0.5,
          py: 0.45,
          transition: "border-color 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: "0 8px 22px rgba(15, 23, 42, 0.08)",
          },
        }}
      >
        <Avatar
          src={user?.avatar || undefined}
          sx={{
            width: 34,
            height: 34,
            bgcolor: "secondary.main",
            color: "white",
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          {user ? initials : <PersonIcon fontSize="small" />}
        </Avatar>
        {user && <KeyboardArrowDownIcon sx={{ display: { xs: "none", sm: "block" }, fontSize: 19, color: "text.secondary" }} />}
      </IconButton>
    </Tooltip>
  );

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
          height: { xs: "auto", md: scrolled ? 78 : 174 },
          overflow: "hidden",
          transition: "height 180ms ease",
        }}
      >
        <Toolbar disableGutters sx={{ minHeight: { xs: 72, md: 78 }, gap: { xs: 1, md: 2 } }}>
          <Stack component={RouterLink} to="/listings" direction="row" spacing={1.1} alignItems="center" sx={{ color: "primary.main", minWidth: { md: 210 }, textDecoration: "none" }}>
            <TravelExploreIcon color="primary" sx={{ fontSize: 32 }} />
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
              spacing={{ md: 1.2, lg: 2.4 }}
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
              <Button component={RouterLink} to="/listings" color="secondary" startIcon={<HomeWorkIcon sx={{ fontSize: 20 }} />} sx={navItemSx(homesActive)}>
                Homes
              </Button>
              <Button component={RouterLink} to="/listings?category=Trending" color="secondary" startIcon={<ExploreIcon sx={{ fontSize: 20 }} />} sx={navItemSx(experiencesActive)}>
                Experiences
              </Button>
              <Button component={RouterLink} to="/listings?category=Rooms" color="secondary" startIcon={<RoomServiceIcon sx={{ fontSize: 20 }} />} sx={navItemSx(servicesActive)}>
                Services
              </Button>
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

          <Stack direction="row" spacing={{ md: 0.8, lg: 1.2 }} alignItems="center" justifyContent="flex-end" sx={{ minWidth: { md: 250 }, display: { xs: "none", md: "flex" } }}>
            <Button
              component={RouterLink}
              to="/listings/new"
              color="secondary"
              variant="outlined"
              startIcon={<AddHomeWorkIcon sx={{ fontSize: 20 }} />}
              sx={{ px: { md: 1.7, lg: 2.2 }, whiteSpace: "nowrap", bgcolor: "background.paper" }}
            >
              Add Listing
            </Button>
            {!user && <Button component={RouterLink} to="/login" color="secondary">Login</Button>}
            {!user && <Button component={RouterLink} to="/signup" variant="contained">Signup</Button>}
            {user && wishlistButton()}
            {user && avatarButton}
          </Stack>

          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
            {user && wishlistButton(true)}
            {user && avatarButton}
            <Tooltip title="Open navigation">
              <IconButton
                aria-label="Open mobile navigation"
                onClick={() => setMobileDrawerOpen(true)}
                sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>

        <Menu
          id="account-menu"
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={closeUserMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1.2,
              minWidth: 240,
              borderRadius: 3,
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
              <MenuItem onClick={menuNavigate("/dashboard")}><DashboardIcon fontSize="small" sx={{ mr: 1 }} /> Dashboard</MenuItem>
              <MenuItem onClick={menuNavigate("/dashboard#my-listings")}><HomeWorkIcon fontSize="small" sx={{ mr: 1 }} /> My Listings</MenuItem>
              <MenuItem onClick={menuNavigate("/wishlist")}><FavoriteIcon fontSize="small" sx={{ mr: 1 }} /> Wishlist</MenuItem>
              <MenuItem onClick={menuNavigate("/dashboard#profile")}><PersonIcon fontSize="small" sx={{ mr: 1 }} /> Profile & Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main", fontWeight: 800 }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Box>
          ) : (
            <Box>
              <MenuItem onClick={menuNavigate("/login")}>Login</MenuItem>
              <MenuItem onClick={menuNavigate("/signup")}>Signup</MenuItem>
            </Box>
          )}
        </Menu>

        <Drawer anchor="right" open={mobileDrawerOpen} onClose={closeMobileDrawer}>
          <Box sx={{ width: 300, p: 2.5 }} role="presentation">
            <Stack spacing={1}>
              <Stack direction="row" spacing={1.1} alignItems="center" sx={{ color: "primary.main", mb: 1 }}>
                <TravelExploreIcon color="primary" sx={{ fontSize: 30 }} />
                <Typography variant="h6" fontWeight={900}>Wanderlust</Typography>
              </Stack>
              <Divider />
              <MenuItem component={RouterLink} to="/listings" onClick={closeMobileDrawer}><HomeWorkIcon fontSize="small" sx={{ mr: 1 }} /> Homes</MenuItem>
              <MenuItem component={RouterLink} to="/listings?category=Trending" onClick={closeMobileDrawer}><ExploreIcon fontSize="small" sx={{ mr: 1 }} /> Experiences</MenuItem>
              <MenuItem component={RouterLink} to="/listings?category=Rooms" onClick={closeMobileDrawer}><RoomServiceIcon fontSize="small" sx={{ mr: 1 }} /> Services</MenuItem>
              <Divider />
              {user && <MenuItem component={RouterLink} to="/dashboard" onClick={closeMobileDrawer}><DashboardIcon fontSize="small" sx={{ mr: 1 }} /> Dashboard</MenuItem>}
              <MenuItem component={RouterLink} to="/listings/new" onClick={closeMobileDrawer}><AddHomeWorkIcon fontSize="small" sx={{ mr: 1 }} /> Add Listing</MenuItem>
              {user && <MenuItem component={RouterLink} to="/wishlist" onClick={closeMobileDrawer}><FavoriteIcon fontSize="small" sx={{ mr: 1 }} /> Wishlist</MenuItem>}
              {user && <MenuItem component={RouterLink} to="/dashboard#profile" onClick={closeMobileDrawer}><PersonIcon fontSize="small" sx={{ mr: 1 }} /> Profile</MenuItem>}
              {!user && <MenuItem component={RouterLink} to="/login" onClick={closeMobileDrawer}>Login</MenuItem>}
              {!user && <MenuItem component={RouterLink} to="/signup" onClick={closeMobileDrawer}>Signup</MenuItem>}
              {user && (
                <>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: "error.main", fontWeight: 800 }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </>
              )}
            </Stack>
          </Box>
        </Drawer>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            pt: 2.7,
            pb: 2.8,
            opacity: scrolled ? 0 : 1,
            transform: scrolled ? "translateY(-24px) scale(0.94)" : "translateY(0) scale(1)",
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
