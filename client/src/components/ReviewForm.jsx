import { useState } from "react";
import { Alert, Button, Paper, Rating, Stack, TextField, Typography } from "@mui/material";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await onSubmit({ rating: Number(rating), comment });
      setRating(5);
      setComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
      <Stack spacing={2}>
        <Typography variant="h6">Leave a Review</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack spacing={0.75}>
          <Typography fontWeight={700}>Rating</Typography>
          <Rating value={rating} onChange={(_, value) => setRating(value || 1)} />
        </Stack>
        <TextField
          label="Comments"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          required
          multiline
          minRows={4}
          fullWidth
        />
        <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
          Submit Review
        </Button>
      </Stack>
    </Paper>
  );
}
