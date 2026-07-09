import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useFlash } from "../context/FlashContext.jsx";
import { apiFetch } from "../services/api.js";

export default function ListingCard({ listing, showTaxes = false, onWishlistChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();
  const { showFlash } = useFlash();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const price = Number(listing.price || 0);
  const estimatedTaxRate = 0.12;
  const totalPrice = showTaxes ? Math.round(price * (1 + estimatedTaxRate)) : price;
  const wishlistIds = user?.wishlist?.map((id) => String(id)) || [];
  const isSaved = wishlistIds.includes(String(listing._id));

  const handleWishlistClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setWishlistLoading(true);

    try {
      await apiFetch(`/api/wishlist/${listing._id}`, {
        method: isSaved ? "DELETE" : "POST",
      });
      await refreshUser();
      showFlash("success", isSaved ? "Removed from wishlist." : "Saved to wishlist.");
      onWishlistChange?.(listing._id, !isSaved);
    } catch (err) {
      showFlash("error", err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <Card sx={{ height: "100%", overflow: "hidden" }}>
      <CardActionArea component={RouterLink} to={`/listings/${listing._id}`} sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={listing.image?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"}
            alt={listing.title}
            sx={{ aspectRatio: "1.16", objectFit: "cover", transition: "transform 220ms ease", ".MuiCardActionArea-root:hover &": { transform: "scale(1.04)" } }}
          />
          <Tooltip title={isSaved ? "Remove from wishlist" : "Save to wishlist"}>
            <IconButton
              aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
              onClick={handleWishlistClick}
              disabled={wishlistLoading}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                bgcolor: "rgba(255, 255, 255, 0.92)",
                color: isSaved ? "primary.main" : "text.primary",
                "&:hover": {
                  bgcolor: "white",
                },
              }}
            >
              {isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <CardContent sx={{ width: "100%", p: 2.2 }}>
          <Typography variant="h6" noWrap>
            {listing.title}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary" sx={{ mt: 0.5 }}>
            <PlaceIcon fontSize="small" />
            <Typography variant="body2" noWrap>
              {[listing.location, listing.country].filter(Boolean).join(", ")}
            </Typography>
          </Stack>
          <Typography sx={{ mt: 1.3 }} fontWeight={900}>
            ${totalPrice.toLocaleString("en-US")} / night
          </Typography>
          {showTaxes && (
            <Typography variant="caption" color="text.secondary">
              Base ${price.toLocaleString("en-US")} + estimated lodging taxes
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
