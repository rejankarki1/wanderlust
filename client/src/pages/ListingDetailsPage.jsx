import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardMedia,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Paper,
  Rating,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlaceIcon from "@mui/icons-material/Place";
import ReviewForm from "../components/ReviewForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFlash } from "../context/FlashContext.jsx";
import { apiFetch } from "../services/api.js";

const idsMatch = (first, second) => String(first || "") === String(second || "");

export default function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showFlash } = useFlash();
  const [listing, setListing] = useState(null);
  const [mapToken, setMapToken] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [deleteListingOpen, setDeleteListingOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const mapContainerRef = useRef(null);

  const loadListing = () => {
    setError("");
    apiFetch(`/api/listings/${id}`)
      .then((data) => {
        setListing(data.listing);
        setMapToken(data.mapToken || "");
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadListing();
  }, [id]);

  const isOwner = user && listing?.owner && idsMatch(user._id, listing.owner._id);

  useEffect(() => {
    if (activeTab !== "location" || !listing?.geometry?.coordinates || !mapToken || !mapContainerRef.current || !window.mapboxgl) {
      return undefined;
    }

    window.mapboxgl.accessToken = mapToken;

    const map = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: listing.geometry.coordinates,
      zoom: 9,
    });

    new window.mapboxgl.Marker({ color: "#fe424d" })
      .setLngLat(listing.geometry.coordinates)
      .setPopup(
        new window.mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
        )
      )
      .addTo(map);

    return () => map.remove();
  }, [activeTab, listing, mapToken]);

  const handleDeleteListing = async () => {
    await apiFetch(`/api/listings/${id}`, { method: "DELETE" });
    showFlash("success", "Listing deleted.");
    navigate("/listings");
  };

  const handleReviewSubmit = async (review) => {
    await apiFetch(`/api/listings/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify({ review }),
    });
    showFlash("success", "Review created.");
    loadListing();
  };

  const handleDeleteReview = async (reviewId) => {
    await apiFetch(`/api/listings/${id}/reviews/${reviewId}`, { method: "DELETE" });
    showFlash("success", "Review deleted.");
    setReviewToDelete(null);
    loadListing();
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!listing) {
    return (
      <Stack spacing={2.5} sx={{ maxWidth: 980, mx: "auto" }}>
        <Skeleton width={260} height={28} />
        <Skeleton variant="rounded" height={420} sx={{ borderRadius: 4 }} />
        <Skeleton width="55%" height={42} />
        <Skeleton width="85%" />
        <Skeleton width="70%" />
      </Stack>
    );
  }

  return (
    <Box sx={{ maxWidth: 980, mx: "auto" }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/listings">
          Listings
        </Link>
        <Typography color="text.primary">{listing.title}</Typography>
      </Breadcrumbs>

      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 2.5 }}>
        <Box>
          <Typography variant="h3">{listing.title}</Typography>
          <Stack direction="row" spacing={0.75} alignItems="center" color="text.secondary" sx={{ mt: 0.8 }}>
            <PlaceIcon fontSize="small" />
            <Typography>{[listing.location, listing.country].filter(Boolean).join(", ")}</Typography>
          </Stack>
        </Box>
        {isOwner && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={RouterLink} to={`/listings/${id}/edit`} variant="outlined" startIcon={<EditIcon />}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => setDeleteListingOpen(true)}>
              Delete
            </Button>
          </Stack>
        )}
      </Stack>

      <Card sx={{ overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={listing.image?.url}
          alt={listing.title}
          sx={{
            width: "100%",
            height: { xs: 220, sm: 280, md: 340 },
            objectFit: "cover",
          }}
        />
      </Card>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="flex-start" sx={{ mt: 3 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Tab label="Overview" value="overview" />
            <Tab label={`Reviews (${listing.reviews?.length || 0})`} value="reviews" />
            <Tab label="Location" value="location" />
          </Tabs>

          {activeTab === "overview" && (
            <Stack spacing={2.5}>
              {listing.owner && (
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Avatar>{listing.owner.username?.[0]?.toUpperCase()}</Avatar>
                  <Box>
                    <Typography fontWeight={800}>Owned by @{listing.owner.username}</Typography>
                    <Typography variant="body2" color="text.secondary">{listing.owner.email}</Typography>
                  </Box>
                </Stack>
              )}
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{listing.description}</Typography>
            </Stack>
          )}

          {activeTab === "reviews" && (
            <Stack spacing={2}>
              <Typography variant="h4">Reviews</Typography>
              {user ? <ReviewForm onSubmit={handleReviewSubmit} /> : <Alert severity="info">Log in to leave a review.</Alert>}
              <Divider />
              {listing.reviews?.length > 0 ? (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
                  {listing.reviews.map((review) => {
                    const isAuthor = user && review.author && idsMatch(user._id, review.author._id);

                    return (
                      <Box key={review._id}>
                        <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider", height: "100%" }}>
                          <Stack spacing={1}>
                            <Typography fontWeight={800}>@{review.author?.username || "Anonymous"}</Typography>
                            <Rating value={Number(review.rating)} readOnly size="small" />
                            <Typography>{review.comment}</Typography>
                            {isAuthor && (
                              <Button color="secondary" size="small" startIcon={<DeleteIcon />} onClick={() => setReviewToDelete(review)} sx={{ alignSelf: "flex-start" }}>
                                Delete
                              </Button>
                            )}
                          </Stack>
                        </Paper>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography color="text.secondary">No reviews yet.</Typography>
              )}
            </Stack>
          )}

          {activeTab === "location" && (
            <Stack spacing={2}>
              <Typography variant="h4">Where you'll be</Typography>
              {listing.geometry?.coordinates ? (
                <div id="map" ref={mapContainerRef}></div>
              ) : (
                <Alert severity="info">Location coordinates are not available for this listing.</Alert>
              )}
            </Stack>
          )}
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            width: { xs: "100%", md: 300 },
            border: "1px solid",
            borderColor: "divider",
            position: { md: "sticky" },
            top: { md: 104 },
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5">${Number(listing.price || 0).toLocaleString("en-US")}</Typography>
              <Typography color="text.secondary">per night</Typography>
            </Box>
            <Divider />
            <Typography color="text.secondary">
              Hosted by {listing.owner?.username ? `@${listing.owner.username}` : "the property owner"}
            </Typography>
            <Button variant="contained" fullWidth>
              Reserve
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <Dialog open={deleteListingOpen} onClose={() => setDeleteListingOpen(false)}>
        <DialogTitle>Delete this listing?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove the listing and its reviews.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteListingOpen(false)}>Cancel</Button>
          <Button color="secondary" variant="contained" onClick={handleDeleteListing}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(reviewToDelete)} onClose={() => setReviewToDelete(null)}>
        <DialogTitle>Delete this review?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This review will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewToDelete(null)}>Cancel</Button>
          <Button color="secondary" variant="contained" onClick={() => handleDeleteReview(reviewToDelete?._id)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
