import { Button, Chip, Popover, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import GuestCounter from "./GuestCounter.jsx";

const quickDestinations = [
  "San Marcos",
  "Malibu",
  "New York City",
  "Aspen",
  "Florence",
  "Dubai",
];

export default function SearchPopover({
  activeField,
  anchorEl,
  where,
  setWhere,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  onClose,
}) {
  return (
    <Popover
      open={Boolean(activeField && anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      disableScrollLock
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      slotProps={{
        root: {
          sx: { pointerEvents: "none" },
        },
      }}
      PaperProps={{
        sx: {
          pointerEvents: "auto",
          mt: 1.5,
          width: activeField === "when" ? 520 : 360,
          maxWidth: "calc(100vw - 32px)",
          p: 2.5,
          borderRadius: 4,
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
        },
      }}
    >
      {activeField === "where" && (
        <Stack spacing={2}>
          <Typography variant="h6">Search destinations</Typography>
          <TextField
            autoFocus
            value={where}
            onChange={(event) => setWhere(event.target.value)}
            placeholder="City, state, or country"
            fullWidth
          />
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {quickDestinations.map((destination) => (
              <Chip
                key={destination}
                label={destination}
                clickable
                onClick={() => setWhere(destination)}
                variant={where === destination ? "filled" : "outlined"}
                color={where === destination ? "primary" : "default"}
              />
            ))}
          </Stack>
        </Stack>
      )}

      {activeField === "when" && (
        <Stack spacing={2}>
          <Typography variant="h6">Choose your dates</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DatePicker label="Check in" value={checkIn} onChange={setCheckIn} />
            <DatePicker label="Check out" value={checkOut} minDate={checkIn || undefined} onChange={setCheckOut} />
          </Stack>
          <Button color="secondary" onClick={() => { setCheckIn(null); setCheckOut(null); }} sx={{ alignSelf: "flex-start" }}>
            Clear dates
          </Button>
        </Stack>
      )}

      {activeField === "who" && (
        <Stack spacing={2.5}>
          <Typography variant="h6">Who's coming?</Typography>
          <GuestCounter guests={guests} onChange={setGuests} />
        </Stack>
      )}
    </Popover>
  );
}
