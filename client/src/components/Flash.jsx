import { Alert, Snackbar } from "@mui/material";
import { useFlash } from "../context/FlashContext.jsx";

export default function Flash() {
  const { flash, clearFlash } = useFlash();

  return (
    <Snackbar
      open={Boolean(flash?.message)}
      autoHideDuration={4500}
      onClose={clearFlash}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      {flash?.message ? (
        <Alert
          onClose={clearFlash}
          severity={flash.type === "error" ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%", borderRadius: 3 }}
        >
          {flash.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
