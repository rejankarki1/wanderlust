import { Link as RouterLink } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

export default function NavbarBrand() {
  return (
    <Stack
      component={RouterLink}
      to="/listings"
      direction="row"
      spacing={1.1}
      alignItems="center"
      sx={{
        color: "primary.main",
        minWidth: { md: 210 },
        textDecoration: "none",
      }}
    >
      <TravelExploreIcon color="primary" sx={{ fontSize: 32 }} />
      <Typography variant="h6" fontWeight={900} sx={{ display: { xs: "none", sm: "block" } }}>
        Wanderlust
      </Typography>
    </Stack>
  );
}
