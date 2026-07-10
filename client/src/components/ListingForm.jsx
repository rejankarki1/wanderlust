import { useEffect, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { categories } from "../constants/listingCategories.js";

const allowedImageTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
const allowedImageFormats = "PNG, JPG, JPEG, or WEBP";

const imageFormatError = (file) => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "selected";
  return `Image file format ${extension} not allowed. Please upload ${allowedImageFormats}.`;
};

export default function ListingForm({
  initialListing,
  submitLabel,
  requireImage = false,
  onError,
  onSubmit,
}) {
  const [category, setCategory] = useState(initialListing?.category || "Trending");
  const [imageName, setImageName] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const originalImageUrl = initialListing?.image?.url?.replace("/upload", "/upload/w_250");

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get("image");

    if (imageFile?.size > 0 && !allowedImageTypes.has(imageFile.type)) {
      onError?.(imageFormatError(imageFile));
      return;
    }

    onSubmit(
      {
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        maxGuests: formData.get("maxGuests"),
        country: formData.get("country"),
        location: formData.get("location"),
        category,
      },
      imageFile
    );
  };

  const clearPreview = () => {
    setImageName("");

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setImagePreviewUrl("");
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid", borderColor: "divider" }}>
      <Stack spacing={2.4}>
        <TextField name="title" label="Title" defaultValue={initialListing?.title || ""} required fullWidth />
        <TextField
          name="description"
          label="Description"
          defaultValue={initialListing?.description || ""}
          required
          fullWidth
          multiline
          minRows={4}
        />

        {(imagePreviewUrl || originalImageUrl) && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={imagePreviewUrl || originalImageUrl}
              variant="rounded"
              sx={{ width: 128, height: 96 }}
            />
            <Box>
              <Typography fontWeight={800}>
                {imagePreviewUrl ? "Selected image preview" : "Current listing image"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {imagePreviewUrl ? imageName : "Upload a new file only if you want to replace it."}
              </Typography>
            </Box>
          </Stack>
        )}

        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ alignSelf: "flex-start" }}>
          {requireImage ? "Upload Image" : "Upload New Image"}
          <input
            hidden
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            required={requireImage}
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) {
                clearPreview();
                return;
              }

              if (!allowedImageTypes.has(file.type)) {
                event.target.value = "";
                clearPreview();
                onError?.(imageFormatError(file));
                return;
              }

              setImageName(file.name);

              if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
              }

              setImagePreviewUrl(URL.createObjectURL(file));
            }}
          />
        </Button>

        <Autocomplete
          options={categories}
          value={category}
          onChange={(_, value) => setCategory(value || "Trending")}
          renderInput={(params) => <TextField {...params} label="Category" required />}
        />

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            name="price"
            type="number"
            label="Price per night"
            defaultValue={initialListing?.price || ""}
            required
            fullWidth
            helperText="Maximum $5,000 per night"
            inputProps={{ min: 0, max: 5000 }}
          />
          <TextField name="maxGuests" type="number" label="Max guests" defaultValue={initialListing?.maxGuests || 4} required fullWidth inputProps={{ min: 1, max: 50 }} />
          <TextField name="country" label="Country" defaultValue={initialListing?.country || ""} required fullWidth />
        </Stack>

        <TextField name="location" label="Location" defaultValue={initialListing?.location || ""} required fullWidth />

        <Button type="submit" variant="contained" size="large" sx={{ alignSelf: "flex-start" }}>
          {submitLabel}
        </Button>
      </Stack>
    </Paper>
  );
}
