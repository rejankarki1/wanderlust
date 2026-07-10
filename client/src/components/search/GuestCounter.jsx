import { Box, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function GuestCounter({ guests, onChange }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={3}>
      <Box>
        <Typography fontWeight={900}>Guests</Typography>
        <Typography variant="body2" color="text.secondary">Adults and children</Typography>
      </Box>
      <Stack direction="row" spacing={1.2} alignItems="center">
        <IconButton
          size="small"
          disabled={guests <= 1}
          onClick={() => onChange(Math.max(1, guests - 1))}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography fontWeight={900} sx={{ minWidth: 26, textAlign: "center" }}>{guests}</Typography>
        <IconButton
          size="small"
          onClick={() => onChange(Math.min(10, guests + 1))}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
