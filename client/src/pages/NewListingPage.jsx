import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import ListingForm from "../components/ListingForm.jsx";
import { useFlash } from "../context/FlashContext.jsx";
import { apiFetch, toListingFormData } from "../services/api.js";

export default function NewListingPage() {
  const navigate = useNavigate();
  const { showFlash } = useFlash();

  const handleSubmit = async (listing, imageFile) => {
    try {
      const data = await apiFetch("/api/listings", {
        method: "POST",
        body: toListingFormData(listing, imageFile),
      });
      showFlash("success", "New listing created.");
      navigate(`/listings/${data.listing._id}`);
    } catch (err) {
      showFlash("error", err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 820, mx: "auto" }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/listings">
          Listings
        </Link>
        <Typography color="text.primary">New listing</Typography>
      </Breadcrumbs>
      <Typography variant="h3" sx={{ mb: 3 }}>Create a New Listing</Typography>
      <ListingForm
        submitLabel="Add Listing"
        requireImage
        onError={(message) => showFlash("error", message)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
