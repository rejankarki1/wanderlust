import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PaymentsIcon from "@mui/icons-material/Payments";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import VerifiedIcon from "@mui/icons-material/Verified";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ListingCard from "../components/ListingCard.jsx";
import { apiFetch } from "../services/api.js";

const formatRating = (rating) => (rating === null || rating === undefined ? "No ratings" : `${rating.toFixed(1)} / 5`);
const formatDate = (value) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(new Date(value));

function StatCard({ label, value, helper }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider", height: "100%" }}>
      <Typography variant="h4">{value}</Typography>
      <Typography fontWeight={800}>{label}</Typography>
      {helper && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>{helper}</Typography>}
    </Paper>
  );
}

function EmptyPanel({ title, description, action }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", textAlign: "center" }}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>{description}</Typography>
      {action}
    </Paper>
  );
}

function BookingCard({ booking, mode, onCancel }) {
  const canCancel = booking.status === "confirmed";
  const listing = booking.listing;

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Box
          component="img"
          src={listing?.image?.url}
          alt={listing?.title || "Reserved listing"}
          sx={{ width: { xs: "100%", sm: 150 }, aspectRatio: "1.2", objectFit: "cover", borderRadius: 3 }}
        />
        <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h6" noWrap>{listing?.title || "Deleted listing"}</Typography>
            <Chip
              label={booking.status}
              size="small"
              color={booking.status === "confirmed" ? "success" : "default"}
              variant={booking.status === "confirmed" ? "filled" : "outlined"}
            />
          </Stack>
          <Typography color="text.secondary" noWrap>
            {[listing?.location, listing?.country].filter(Boolean).join(", ")}
          </Typography>
          <Typography variant="body2">
            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} · {booking.totalNights} nights · {booking.guests} guests
          </Typography>
          <Typography fontWeight={900}>${Number(booking.totalPrice || 0).toLocaleString("en-US")} total</Typography>
          <Typography variant="body2" color="text.secondary">
            {mode === "guest"
              ? `Hosted by @${booking.owner?.username || "owner"}`
              : `Guest: @${booking.guest?.username || "guest"}`}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {listing?._id && <Button component={RouterLink} to={`/listings/${listing._id}`} size="small" startIcon={<VisibilityIcon />}>View</Button>}
            {canCancel && (
              <Button color="secondary" size="small" onClick={() => onCancel(booking._id)}>
                Cancel
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    apiFetch("/api/dashboard")
      .then((data) => setDashboard(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSavedListingChange = (listingId, saved) => {
    if (!saved) {
      setDashboard((current) => ({
        ...current,
        savedListings: current.savedListings.filter((listing) => String(listing._id) !== String(listingId)),
        stats: {
          ...current.stats,
          totalSavedListings: Math.max((current.stats?.totalSavedListings || 1) - 1, 0),
        },
      }));
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const data = await apiFetch(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" });

    setDashboard((current) => ({
      ...current,
      guestBookings: current.guestBookings.map((booking) => (
        String(booking._id) === String(bookingId) ? data.booking : booking
      )),
      hostBookings: current.hostBookings.map((booking) => (
        String(booking._id) === String(bookingId) ? data.booking : booking
      )),
    }));
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading || !dashboard) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={180} sx={{ borderRadius: 4 }} />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" }, gap: 2 }}>
          {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} variant="rounded" height={120} sx={{ borderRadius: 4 }} />)}
        </Box>
        <Skeleton variant="rounded" height={260} sx={{ borderRadius: 4 }} />
      </Stack>
    );
  }

  const { user, stats, ownedListings = [], savedListings = [], guestBookings = [], hostBookings = [] } = dashboard;
  const savedPreview = savedListings.slice(0, 4);
  const confirmedGuestBookings = guestBookings.filter((booking) => booking.status === "confirmed");
  const confirmedHostBookings = hostBookings.filter((booking) => booking.status === "confirmed");
  const cancelledGuestBookings = guestBookings.filter((booking) => booking.status === "cancelled");
  const cancelledHostBookings = hostBookings.filter((booking) => booking.status === "cancelled");
  const upcomingTrips = confirmedGuestBookings.slice(0, 4);
  const upcomingHostBookings = confirmedHostBookings.slice(0, 4);
  const cancelledBookings = [
    ...cancelledGuestBookings.map((booking) => ({ ...booking, dashboardMode: "guest" })),
    ...cancelledHostBookings.map((booking) => ({ ...booking, dashboardMode: "host" })),
  ].sort((first, second) => new Date(second.cancelledAt || second.updatedAt || second.createdAt) - new Date(first.cancelledAt || first.updatedAt || first.createdAt));
  const authLabel = user.authProvider === "google" ? "Google account" : "Local account";
  const avatarLetter = user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U";

  return (
    <Stack spacing={4}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: "1px solid", borderColor: "divider" }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user.avatar || undefined} sx={{ width: 76, height: 76, bgcolor: "primary.main", fontSize: 30, fontWeight: 900 }}>
              {avatarLetter}
            </Avatar>
            <Box>
              <Typography variant="h3">Dashboard</Typography>
              <Typography color="text.secondary">@{user.username}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                <Chip label={authLabel} color="secondary" variant="outlined" />
                <Chip
                  icon={<VerifiedIcon />}
                  label={user.emailVerified ? "Email verified" : "Email not verified"}
                  color={user.emailVerified ? "success" : "default"}
                  variant={user.emailVerified ? "filled" : "outlined"}
                />
              </Stack>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
            <Button component={RouterLink} to="/listings/new" variant="contained" startIcon={<AddHomeWorkIcon />}>Add Listing</Button>
            <Button component={RouterLink} to="/wishlist" variant="outlined" startIcon={<FavoriteIcon />}>View Wishlist</Button>
            <Button component={RouterLink} to="/listings" variant="outlined" startIcon={<TravelExploreIcon />}>Browse</Button>
          </Stack>
        </Stack>
        <Divider sx={{ my: 2.5 }} />
        <Typography color="text.secondary">{user.email}</Typography>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }, gap: 2 }}>
        <StatCard label="Owned listings" value={stats.totalOwnedListings} helper="Places you host" />
        <StatCard label="Saved listings" value={stats.totalSavedListings} helper="Wishlist count" />
        <StatCard label="Reviews received" value={stats.totalReviewsReceived} helper="Across your listings" />
        <StatCard label="Average rating" value={formatRating(stats.averageRating)} helper={stats.highestRatedListing ? `Top: ${stats.highestRatedListing.title}` : "No reviewed listings yet"} />
      </Box>

      <Stack spacing={2.2}>
        <Box>
          <Typography variant="h4">My Trips</Typography>
          <Typography color="text.secondary">Active reservations you have made as a guest.</Typography>
        </Box>

        {upcomingTrips.length === 0 ? (
          <EmptyPanel
            title="No trips yet."
            description="Reserve a stay and your trip will appear here."
            action={<Button component={RouterLink} to="/listings" variant="contained">Browse Listings</Button>}
          />
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
            {upcomingTrips.map((booking) => (
              <BookingCard key={booking._id} booking={booking} mode="guest" onCancel={handleCancelBooking} />
            ))}
          </Box>
        )}
      </Stack>

      <Stack spacing={2.2}>
        <Box>
          <Typography variant="h4">Host Bookings</Typography>
          <Typography color="text.secondary">Active reservations guests made for your listings.</Typography>
        </Box>

        {upcomingHostBookings.length === 0 ? (
          <EmptyPanel
            title="No host bookings yet."
            description="Guest reservations for your listings will appear here."
            action={<Button component={RouterLink} to="/listings/new" variant="contained">Add Listing</Button>}
          />
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
            {upcomingHostBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} mode="host" onCancel={handleCancelBooking} />
            ))}
          </Box>
        )}
      </Stack>

      {cancelledBookings.length > 0 && (
        <Stack spacing={2.2}>
          <Box>
            <Typography variant="h4">Cancelled Bookings</Typography>
            <Typography color="text.secondary">Cancelled guest and host reservations stay here for your records.</Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
            {cancelledBookings.map((booking) => (
              <BookingCard
                key={`${booking.dashboardMode}-${booking._id}`}
                booking={booking}
                mode={booking.dashboardMode}
                onCancel={handleCancelBooking}
              />
            ))}
          </Box>
        </Stack>
      )}

      <Stack spacing={2.2}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
          <Box>
            <Typography variant="h4">My Listings</Typography>
            <Typography color="text.secondary">Manage places you have published.</Typography>
          </Box>
          <Button component={RouterLink} to="/listings/new" variant="outlined" startIcon={<AddHomeWorkIcon />}>Add Listing</Button>
        </Stack>

        {ownedListings.length === 0 ? (
          <EmptyPanel
            title="No listings yet."
            description="Create your first stay and it will appear here."
            action={<Button component={RouterLink} to="/listings/new" variant="contained">Create Listing</Button>}
          />
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
            {ownedListings.map((listing) => (
              <Paper key={listing._id} elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Box component="img" src={listing.image?.url} alt={listing.title} sx={{ width: { xs: "100%", sm: 170 }, aspectRatio: "1.2", objectFit: "cover", borderRadius: 3 }} />
                  <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" noWrap>{listing.title}</Typography>
                    <Typography color="text.secondary" noWrap>{[listing.location, listing.country].filter(Boolean).join(", ")}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Rating value={listing.dashboardStats.averageRating || 0} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {listing.dashboardStats.reviewCount} reviews
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Button component={RouterLink} to={`/listings/${listing._id}`} size="small" startIcon={<VisibilityIcon />}>View</Button>
                      <Button component={RouterLink} to={`/listings/${listing._id}/edit`} size="small" color="secondary" startIcon={<EditIcon />}>Edit</Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Box>
        )}
      </Stack>

      <Stack spacing={2.2}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
          <Box>
            <Typography variant="h4">Saved Listings</Typography>
            <Typography color="text.secondary">A quick preview from your wishlist.</Typography>
          </Box>
          <Button component={RouterLink} to="/wishlist" variant="outlined" startIcon={<FavoriteIcon />}>View All</Button>
        </Stack>

        {savedPreview.length === 0 ? (
          <EmptyPanel
            title="No saved listings yet."
            description="Use the heart button on listings to save places for later."
            action={<Button component={RouterLink} to="/listings" variant="contained">Browse Listings</Button>}
          />
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }, gap: 3 }}>
            {savedPreview.map((listing) => (
              <ListingCard key={listing._id} listing={listing} onWishlistChange={handleSavedListingChange} />
            ))}
          </Box>
        )}
      </Stack>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h5">Coming Next</Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ mt: 2 }}>
          <Chip icon={<PaymentsIcon />} label="Payment status" variant="outlined" />
          <Chip icon={<AnalyticsIcon />} label="Host analytics" variant="outlined" />
        </Stack>
      </Paper>
    </Stack>
  );
}
