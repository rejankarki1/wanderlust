import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import EditListingPage from "./pages/EditListingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListingDetailsPage from "./pages/ListingDetailsPage.jsx";
import ListingsPage from "./pages/ListingsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NewListingPage from "./pages/NewListingPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<ListingDetailsPage />} />
        <Route
          path="/listings/new"
          element={
            <ProtectedRoute>
              <NewListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute>
              <EditListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
