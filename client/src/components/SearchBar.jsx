import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";

const toDate = (value) => (value && dayjs(value).isValid() ? dayjs(value) : null);

const quickDestinations = [
  "San Marcos",
  "Malibu",
  "New York City",
  "Aspen",
  "Florence",
  "Dubai",
];

function GuestCounter({ guests, onChange }) {
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
          onClick={() => onChange(Math.min(50, guests + 1))}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

function SearchField({ field, label, value, icon, activeField, onActivate, children }) {
  const active = activeField === field;
  const dimmed = Boolean(activeField) && !active;

  return (
    <Box
      component={motion.div}
      layout
      onClick={onActivate}
      sx={{
        flex: 1,
        minWidth: 0,
        borderRight: { sm: "1px solid #e5e7eb" },
        borderBottom: { xs: "1px solid #e5e7eb", sm: "none" },
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <Box
        component={motion.div}
        animate={{
          backgroundColor: active ? "#ffffff" : dimmed ? "#f8fafc" : "#ffffff",
        }}
        transition={{ duration: 0.2 }}
        sx={{ px: 3, py: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            component={motion.div}
            animate={{ color: active ? "#fe424d" : "#475569" }}
            transition={{ duration: 0.2 }}
            sx={{ display: "flex" }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box
              component={motion.div}
              animate={{ color: active ? "#fe424d" : "#64748b" }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 4,
              }}
            >
              {label}
            </Box>
            {children || (
              <Typography noWrap color={value ? "text.primary" : "text.secondary"} sx={{ fontSize: 15 }}>
                {value}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default function SearchBar({ variant = "expanded" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeField, setActiveField] = useState(null);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [expandedAnchor, setExpandedAnchor] = useState(null);
  const [where, setWhere] = useState(searchParams.get("where") || searchParams.get("search") || "");
  const [checkIn, setCheckIn] = useState(toDate(searchParams.get("checkIn")));
  const [checkOut, setCheckOut] = useState(toDate(searchParams.get("checkOut")));
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 1);
  const activeCategory = searchParams.get("category") || "";
  const compact = variant === "compact";
  const mobile = variant === "mobile";

  useEffect(() => {
    setWhere(searchParams.get("where") || searchParams.get("search") || "");
    setCheckIn(toDate(searchParams.get("checkIn")));
    setCheckOut(toDate(searchParams.get("checkOut")));
    setGuests(Number(searchParams.get("guests")) || 1);
  }, [searchParams]);

  const labels = useMemo(() => {
    const dates = checkIn || checkOut ? [checkIn?.format("MMM D"), checkOut?.format("MMM D")].filter(Boolean).join(" - ") : "";
    return {
      where: where.trim() || (compact ? "Anywhere" : "Search destinations"),
      when: dates || (compact ? "Anytime" : "Add dates"),
      who: guests > 1 ? `${guests} guests` : "Add guests",
    };
  }, [where, checkIn, checkOut, guests, compact]);

  const submitSearch = () => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (where.trim()) params.set("where", where.trim());
    if (checkIn) params.set("checkIn", checkIn.format("YYYY-MM-DD"));
    if (checkOut) params.set("checkOut", checkOut.format("YYYY-MM-DD"));
    if (guests > 1) params.set("guests", String(guests));

    setActiveField(null);
    setPopoverAnchor(null);
    navigate(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitSearch();
  };

  const openPopover = (field) => (event) => {
    setActiveField(field);
    setPopoverAnchor(expandedAnchor || event.currentTarget);
  };

  const closePopover = () => {
    setActiveField(null);
    setPopoverAnchor(null);
  };

  if (mobile) {
    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            px: 1.2,
            py: 0.7,
            boxShadow: "0 8px 26px rgba(15, 23, 42, 0.12)",
          }}
        >
          <TextField
            value={where}
            onChange={(event) => setWhere(event.target.value)}
            placeholder="Where to?"
            variant="standard"
            fullWidth
            InputProps={{ disableUnderline: true }}
            sx={{ px: 1 }}
          />
          <IconButton type="submit" aria-label="Search listings" sx={{ bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" } }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
    );
  }

  if (compact) {
    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "min(100%, 570px)" }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #e5e7eb",
            borderRadius: 999,
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.14)",
            overflow: "hidden",
            pl: 1,
          }}
        >
          <Button color="secondary" onClick={openPopover("where")} startIcon={<LocationOnIcon />} sx={{ color: "text.primary", minWidth: 140 }}>{labels.where}</Button>
          <Divider orientation="vertical" flexItem />
          <Button color="secondary" onClick={openPopover("when")} sx={{ color: "text.primary", minWidth: 130 }}>{labels.when}</Button>
          <Divider orientation="vertical" flexItem />
          <Button color="secondary" onClick={openPopover("who")} sx={{ color: "text.primary", minWidth: 130 }}>{labels.who}</Button>
          <IconButton type="submit" aria-label="Search listings" sx={{ bgcolor: "primary.main", color: "primary.contrastText", m: 0.6, "&:hover": { bgcolor: "primary.dark" } }}>
            <SearchIcon />
          </IconButton>
        </Paper>
        <SearchPopover
          activeField={activeField}
          anchorEl={popoverAnchor}
          where={where}
          setWhere={setWhere}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          guests={guests}
          setGuests={setGuests}
          onClose={closePopover}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box component={motion.div} style={{ width: "100%", maxWidth: 1080 }} layout>
        <Box
          component={motion.div}
          animate={{
            boxShadow: activeField ? "0 20px 60px rgba(0, 0, 0, 0.15)" : "0 10px 30px rgba(0, 0, 0, 0.10)",
          }}
          transition={{ duration: 0.3 }}
          style={{ borderRadius: 50, overflow: "hidden" }}
        >
          <Paper
            component="form"
            onSubmit={handleSubmit}
            ref={setExpandedAnchor}
            elevation={0}
            sx={{
              borderRadius: "50px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              bgcolor: "background.paper",
            }}
          >
            <SearchField
              field="where"
              label="Where"
              value={labels.where}
              activeField={activeField}
              onActivate={openPopover("where")}
              icon={<LocationOnIcon sx={{ width: 20, height: 20 }} />}
            >
              <Typography noWrap color={where ? "text.primary" : "text.secondary"} sx={{ fontSize: 15 }}>
                {where || "Search destinations"}
              </Typography>
            </SearchField>

            <SearchField
              field="when"
              label="When"
              value={labels.when}
              activeField={activeField}
              onActivate={openPopover("when")}
              icon={<DateRangeIcon sx={{ width: 20, height: 20 }} />}
            >
              <Typography noWrap color={checkIn || checkOut ? "text.primary" : "text.secondary"} sx={{ fontSize: 15 }}>
                {labels.when}
              </Typography>
            </SearchField>

            <SearchField
              field="who"
              label="Who"
              value={labels.who}
              activeField={activeField}
              onActivate={openPopover("who")}
              icon={<PeopleIcon sx={{ width: 20, height: 20 }} />}
            >
              <Typography noWrap color={guests > 1 ? "text.primary" : "text.secondary"} sx={{ fontSize: 15 }}>
                {labels.who}
              </Typography>
            </SearchField>

            <Box sx={{ display: "flex", alignItems: "center", p: { xs: 1, sm: 1.5 } }}>
              <Box
                component={motion.button}
                type="submit"
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #fe424d 0%, #ff6b6b 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 50,
                  padding: "12px 32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 16,
                }}
                whileHover={{ scale: 1.05, opacity: 0.92 }}
                whileTap={{ scale: 0.95 }}
              >
                <SearchIcon sx={{ width: 20, height: 20 }} />
                Search
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
      <SearchPopover
        activeField={activeField}
        anchorEl={popoverAnchor}
        where={where}
        setWhere={setWhere}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        guests={guests}
        setGuests={setGuests}
        onClose={closePopover}
      />
    </Box>
  );
}

function SearchPopover({
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
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      PaperProps={{
        sx: {
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
