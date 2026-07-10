import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import SearchField from "./search/SearchField.jsx";
import SearchPopover from "./search/SearchPopover.jsx";

const toDate = (value) => (value && dayjs(value).isValid() ? dayjs(value) : null);

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

  useEffect(() => {
    if (!activeField) return undefined;

    const closeOnScroll = () => {
      setActiveField(null);
      setPopoverAnchor(null);
    };

    window.addEventListener("scroll", closeOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, [activeField]);

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

  const closePopover = () => {
    setActiveField(null);
    setPopoverAnchor(null);
  };

  const openPopover = (field) => (event) => {
    if (activeField === field) {
      closePopover();
      return;
    }

    setActiveField(field);
    setPopoverAnchor(expandedAnchor || event.currentTarget);
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
      <Box component={motion.div} style={{ width: "100%", maxWidth: 900 }} layout>
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

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flex: "0 0 auto",
                width: { xs: "100%", sm: 160 },
                p: { xs: 1, sm: 1 },
              }}
            >
              <Box
                component={motion.button}
                type="submit"
                animate={{ width: activeField ? 132 : 56 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  height: 56,
                  background: "linear-gradient(135deg, #fe424d 0%, #ff6b6b 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 50,
                  padding: activeField ? "12px 24px" : "12px",
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
                {activeField && <span>Search</span>}
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
