import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

export default function NotFoundPage() {
  return (
    <Box sx={{ maxWidth: 620, mx: "auto", py: 8 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: "divider" }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h3">Page Not Found</Typography>
          <Typography color="text.secondary">The page you requested does not exist.</Typography>
          <Button component={RouterLink} to="/listings" variant="contained">
            Back to listings
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
