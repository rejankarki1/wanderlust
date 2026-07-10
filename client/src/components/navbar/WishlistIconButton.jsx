import { Link as RouterLink } from "react-router-dom";
import { Badge, IconButton, Tooltip, alpha } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function WishlistIconButton({ count, onClick }) {
  return (
    <Tooltip title="Wishlist">
      <IconButton
        component={RouterLink}
        to="/wishlist"
        aria-label="Wishlist"
        onClick={onClick}
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
        <Badge badgeContent={count || null} color="primary" max={99}>
          <FavoriteIcon sx={{ fontSize: 21 }} />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
