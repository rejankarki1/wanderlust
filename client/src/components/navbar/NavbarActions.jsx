import { Link as RouterLink } from "react-router-dom";
import { Avatar, Button, IconButton, Stack, Tooltip, alpha } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";

export function NavbarAvatarButton({ user, initials }) {
  return (
    <Tooltip title={user ? "Profile" : "Login"}>
      <IconButton
        component={RouterLink}
        to={user ? "/dashboard#profile" : "/login"}
        aria-label={user ? "Open profile" : "Login"}
        sx={{
          width: 48,
          height: 48,
          borderRadius: 999,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          transition: "background-color 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
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
      </IconButton>
    </Tooltip>
  );
}

export function NavbarMenuButton({ menuAnchor, onOpen }) {
  return (
    <Tooltip title="Open menu">
      <IconButton
        aria-label="Open account menu"
        aria-controls={menuAnchor ? "account-menu" : undefined}
        aria-haspopup="menu"
        aria-expanded={menuAnchor ? "true" : undefined}
        onClick={onOpen}
        sx={{
          width: 48,
          height: 48,
          color: "text.primary",
          bgcolor: (theme) => alpha(theme.palette.text.primary, 0.06),
          transition: "background-color 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.text.primary, 0.1),
            boxShadow: "0 8px 22px rgba(15, 23, 42, 0.08)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
}

export default function NavbarActions({ user, initials, menuAnchor, onOpenMenu }) {
  return (
    <Stack direction="row" spacing={{ md: 0.8, lg: 1.2 }} alignItems="center" justifyContent="flex-end" sx={{ minWidth: { md: 250 }, display: { xs: "none", md: "flex" } }}>
      <Button
        component={RouterLink}
        to="/listings/new"
        color="secondary"
        sx={{
          px: { md: 1.7, lg: 2.2 },
          whiteSpace: "nowrap",
          fontWeight: 800,
          color: "text.primary",
          borderRadius: 999,
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.text.primary, 0.06),
          },
        }}
      >
        Become a host
      </Button>
      <NavbarAvatarButton user={user} initials={initials} />
      <NavbarMenuButton menuAnchor={menuAnchor} onOpen={onOpenMenu} />
    </Stack>
  );
}
