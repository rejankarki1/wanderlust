import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Flash from "./Flash.jsx";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Container component="main" maxWidth="xl" sx={{ flex: 1, py: { xs: 3, md: 4 } }}>
        <Flash />
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}
