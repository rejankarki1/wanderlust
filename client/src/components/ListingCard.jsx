import { Link as RouterLink } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

export default function ListingCard({ listing, showTaxes = false }) {
  const price = Number(listing.price || 0);
  const estimatedTaxRate = 0.12;
  const totalPrice = showTaxes ? Math.round(price * (1 + estimatedTaxRate)) : price;

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
