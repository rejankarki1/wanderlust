import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListingCard from "../components/ListingCard.jsx";
import { apiFetch } from "../services/api.js";

export default function WishlistPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    apiFetch("/api/wishlist")
      .then((data) => setListings(data.listings || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleWishlistChange = (listingId, saved) => {
    if (!saved) {
      setListings((current) => current.filter((listing) => String(listing._id) !== String(listingId)));
    }
  };

  const listingSkeletons = Array.from({ length: 4 }, (_, index) => (
    <Box key={index}>
      <Skeleton variant="rounded" height={260} sx={{ borderRadius: 4 }} />
      <Skeleton width="70%" sx={{ mt: 1.5 }} />
      <Skeleton width="45%" />
      <Skeleton width="35%" />
    </Box>
  ));

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3">Wishlist</Typography>
          <Typography color="text.secondary">Places you saved for later.</Typography>
        </Box>
        <Button component={RouterLink} to="/listings" variant="outlined" startIcon={<FavoriteIcon />}>
          Browse listings
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 3,
          }}
        >
          {listingSkeletons}
        </Box>
      )}

      {!loading && !error && listings.length === 0 && (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6">No saved listings yet.</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            Save places with the heart button and they will appear here.
          </Typography>
          <Button component={RouterLink} to="/listings" variant="contained">
            Explore listings
          </Button>
        </Paper>
      )}

      {!loading && !error && listings.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 3,
          }}
        >
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} onWishlistChange={handleWishlistChange} />
          ))}
        </Box>
      )}
    </Stack>
  );
}
