import { Box, Container, Link, Stack, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#eeeeee", mt: 6, py: 3 }}>
      <Container maxWidth="xl">
        <Stack spacing={1} alignItems="center">
          <Stack direction="row" spacing={2} aria-label="Social links">
            <FacebookIcon fontSize="small" />
            <InstagramIcon fontSize="small" />
            <LinkedInIcon fontSize="small" />
          </Stack>
          <Typography variant="body2" fontWeight={700}>
            &copy; Wanderlust Private Limited
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link color="inherit" underline="hover" href="/privacy">Privacy</Link>
            <Link color="inherit" underline="hover" href="/terms">Terms</Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
