import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Breadcrumbs, Link, Skeleton, Stack, Typography } from "@mui/material";
import ListingForm from "../components/ListingForm.jsx";
import { useFlash } from "../context/FlashContext.jsx";
import { apiFetch, toListingFormData } from "../services/api.js";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showFlash } = useFlash();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/listings/${id}`)
      .then((data) => setListing(data.listing))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleSubmit = async (nextListing, imageFile) => {
    try {
      await apiFetch(`/api/listings/${id}`, {
        method: "PUT",
        body: toListingFormData(nextListing, imageFile),
      });
      showFlash("success", "Listing updated.");
      navigate(`/listings/${id}`);
    } catch (err) {
      showFlash("error", err.message);
    }
  };

  if (!listing && !error) {
    return (
      <Stack spacing={2.5} sx={{ maxWidth: 820, mx: "auto" }}>
        <Skeleton width={220} height={28} />
        <Skeleton width={300} height={54} />
        <Skeleton variant="rounded" height={460} sx={{ borderRadius: 4 }} />
      </Stack>
    );
  }

  return (
    <Box sx={{ maxWidth: 820, mx: "auto" }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/listings">
          Listings
        </Link>
        {listing && (
          <Link component={RouterLink} underline="hover" color="inherit" to={`/listings/${id}`}>
            {listing.title}
          </Link>
        )}
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>
      <Typography variant="h3" sx={{ mb: 3 }}>Edit Listing</Typography>
      {listing && (
        <ListingForm
          initialListing={listing}
          submitLabel="Save Changes"
          onError={(message) => showFlash("error", message)}
          onSubmit={handleSubmit}
        />
      )}
      {!listing && error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}
