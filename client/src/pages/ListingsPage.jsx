import { useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import CabinIcon from "@mui/icons-material/Cabin";
import CastleIcon from "@mui/icons-material/Castle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DownhillSkiingIcon from "@mui/icons-material/DownhillSkiing";
import FoundationIcon from "@mui/icons-material/Foundation";
import HouseboatIcon from "@mui/icons-material/Houseboat";
import LandscapeIcon from "@mui/icons-material/Landscape";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PoolIcon from "@mui/icons-material/Pool";
import SailingIcon from "@mui/icons-material/Sailing";
import SpaIcon from "@mui/icons-material/Spa";
import TuneIcon from "@mui/icons-material/Tune";
import VillaIcon from "@mui/icons-material/Villa";
import ListingCard from "../components/ListingCard.jsx";
import { categories } from "../constants/listingCategories.js";
import { apiFetch } from "../services/api.js";

const icons = {
  Trending: <LocalFireDepartmentIcon />,
  Rooms: <VillaIcon />,
  "Iconic Cities": <FoundationIcon />,
  Mountains: <LandscapeIcon />,
  Castles: <CastleIcon />,
  "Amazing Pools": <PoolIcon />,
  Camping: <CabinIcon />,
  Farms: <SpaIcon />,
  Arctic: <DownhillSkiingIcon />,
  Domes: <SailingIcon />,
  Boats: <HouseboatIcon />,
};

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterRowRef = useRef(null);
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTaxes, setShowTaxes] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "";
  const activeWhere = searchParams.get("where") || searchParams.get("search") || "";
  const activeCheckIn = searchParams.get("checkIn") || "";
  const activeCheckOut = searchParams.get("checkOut") || "";
  const activeGuests = searchParams.get("guests") || "";
  const activePage = Number.parseInt(searchParams.get("page") || "1", 10);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (activeWhere) params.set("where", activeWhere);
    if (activeCheckIn) params.set("checkIn", activeCheckIn);
    if (activeCheckOut) params.set("checkOut", activeCheckOut);
    if (activeGuests) params.set("guests", activeGuests);
    params.set("page", Number.isFinite(activePage) && activePage > 0 ? String(activePage) : "1");
    params.set("limit", "12");
    return params.toString();
  }, [activeCategory, activeWhere, activeCheckIn, activeCheckOut, activeGuests, activePage]);

  useEffect(() => {
    setLoading(true);
    setError("");

    apiFetch(`/api/listings${queryString ? `?${queryString}` : ""}`)
      .then((data) => {
        setListings(data.listings);
        setPagination(data.pagination || { page: 1, limit: 12, total: data.listings?.length || 0, totalPages: 1 });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [queryString]);

  const categoryUrl = (category) => {
    const params = new URLSearchParams(searchParams);

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.delete("page");

    return `/listings${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const handlePageChange = (_, page) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollFilters = (direction) => {
    filterRowRef.current?.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  };

  const renderCategoryFilters = () =>
    categories.map((category) => (
      <Chip
        key={category}
        icon={icons[category]}
        label={category}
        clickable
        component={RouterLink}
        to={categoryUrl(category)}
        color={activeCategory === category ? "primary" : "default"}
        variant={activeCategory === category ? "filled" : "outlined"}
        onClick={() => setFiltersOpen(false)}
        sx={{ flex: "0 0 auto" }}
      />
    ));

  const renderAllCategoryFilter = () => (
    <Chip
      label="All"
      clickable
      component={RouterLink}
      to={categoryUrl("")}
      color={!activeCategory ? "primary" : "default"}
      variant={!activeCategory ? "filled" : "outlined"}
      onClick={() => setFiltersOpen(false)}
    />
  );

  const listingSkeletons = Array.from({ length: 8 }, (_, index) => (
    <Box key={index}>
      <Skeleton variant="rounded" height={260} sx={{ borderRadius: 4 }} />
      <Skeleton width="70%" sx={{ mt: 1.5 }} />
      <Skeleton width="45%" />
      <Skeleton width="35%" />
    </Box>
  ));

  return (
    <Box sx={{ pt: { xs: 0, md: 0.5 } }}>
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<TuneIcon />}
          onClick={() => setFiltersOpen(true)}
          sx={{ display: { xs: "inline-flex", md: "none" }, borderRadius: 999, flex: "0 0 auto" }}
        >
          Filters
        </Button>
        <IconButton onClick={() => scrollFilters(-1)} aria-label="Scroll categories left" sx={{ display: { xs: "none", md: "inline-flex" } }}>
          <ChevronLeftIcon />
        </IconButton>
        <Stack
          ref={filterRowRef}
          direction="row"
          spacing={1.2}
          sx={{
            flex: 1,
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            py: 0.5,
          }}
        >
          {renderAllCategoryFilter()}
          {renderCategoryFilters()}
        </Stack>
        <IconButton onClick={() => scrollFilters(1)} aria-label="Scroll categories right" sx={{ display: { xs: "none", md: "inline-flex" } }}>
          <ChevronRightIcon />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", lg: "block" } }} />
        <Paper elevation={0} sx={{ display: { xs: "none", lg: "block" }, px: 1.5, py: 0.5, border: "1px solid", borderColor: "divider", borderRadius: 999 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight={700} whiteSpace="nowrap">Include estimated taxes</Typography>
            <Switch size="small" checked={showTaxes} onChange={(event) => setShowTaxes(event.target.checked)} />
          </Stack>
        </Paper>
      </Stack>

      <Drawer anchor="bottom" open={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <Box sx={{ p: 2.5, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <Stack spacing={2.5}>
            <Typography variant="h5">Filters</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {renderAllCategoryFilter()}
              {renderCategoryFilters()}
            </Stack>
            <Divider />
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography fontWeight={700}>Include estimated taxes</Typography>
              <Switch size="small" checked={showTaxes} onChange={(event) => setShowTaxes(event.target.checked)} />
            </Stack>
          </Stack>
        </Box>
      </Drawer>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 3,
          }}
        >
          {listingSkeletons}
        </Box>
      )}
      {!loading && !error && listings.length === 0 && (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6">No destinations matched your search.</Typography>
        </Paper>
      )}
      {!loading && !error && listings.length > 0 && (
        <Stack spacing={4}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {listings.map((listing) => (
              <Box key={listing._id}>
                <ListingCard listing={listing} showTaxes={showTaxes} />
              </Box>
            ))}
          </Box>
          {pagination.totalPages > 1 && (
            <Stack alignItems="center">
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  );
}
