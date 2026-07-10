import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext.jsx";
import { useFlash } from "../context/FlashContext.jsx";
import SearchBar from "./SearchBar.jsx";
import NavbarAccountMenu from "./navbar/NavbarAccountMenu.jsx";
import NavbarActions, { NavbarAvatarButton } from "./navbar/NavbarActions.jsx";
import NavbarBrand from "./navbar/NavbarBrand.jsx";
import NavbarCategoryLinks from "./navbar/NavbarCategoryLinks.jsx";
import NavbarMobileDrawer from "./navbar/NavbarMobileDrawer.jsx";
import WishlistIconButton from "./navbar/WishlistIconButton.jsx";

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
        if (!current && scrollY > 180) {
          return true;
        }

        if (current && scrollY < 24) {
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

  const menuNavigate = (to) => () => {
    closeUserMenu();
    closeMobileDrawer();
    navigate(to);
  };

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
          <NavbarBrand />

          <Box
            sx={{
              flex: 1,
              alignSelf: "stretch",
              position: "relative",
              display: { xs: "none", md: "block" },
              minWidth: 0,
            }}
          >
            <NavbarCategoryLinks
              homesActive={homesActive}
              experiencesActive={experiencesActive}
              servicesActive={servicesActive}
              scrolled={scrolled}
            />

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

          <NavbarActions
            user={user}
            initials={initials}
            menuAnchor={userMenuAnchor}
            onOpenMenu={(event) => setUserMenuAnchor(event.currentTarget)}
          />

          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
            {user && <WishlistIconButton count={wishlistCount} onClick={closeMobileDrawer} />}
            {user && <NavbarAvatarButton user={user} initials={initials} />}
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

        <NavbarAccountMenu
          user={user}
          anchorEl={userMenuAnchor}
          onClose={closeUserMenu}
          onNavigate={menuNavigate}
          onLogout={handleLogout}
          displayName={displayName}
          username={username}
        />

        <NavbarMobileDrawer
          open={mobileDrawerOpen}
          user={user}
          onClose={closeMobileDrawer}
          onLogout={handleLogout}
        />

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
