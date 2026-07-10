import { Link as RouterLink } from "react-router-dom";
import { Button, Stack, alpha } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import RoomServiceIcon from "@mui/icons-material/RoomService";

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

export default function NavbarCategoryLinks({ homesActive, experiencesActive, servicesActive, scrolled }) {
  return (
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
  );
}
