const express = require("express");
const router = express.Router();
const multer = require("multer");
const passport = require("passport");
const { storage } = require("../../cloudConfig");
const wrapAsync = require("../../utils/wrapAsync");
const bookings = require("../../controllers/api/bookings");
const dashboard = require("../../controllers/api/dashboard");
const listings = require("../../controllers/api/listings");
const reviews = require("../../controllers/api/reviews");
const users = require("../../controllers/api/users");
const wishlist = require("../../controllers/api/wishlist");
const {
    isApiLoggedIn,
    isApiOwner,
    isApiReviewAuthor,
    validateApiBooking,
    validateApiListing,
    validateApiReview,
    validateApiSignup,
} = require("./middleware");

const upload = multer({ storage });
const requireGoogleOAuthConfig = (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
        return res.status(503).json({ error: "Google login is not configured." });
    }

    next();
};

router.get("/me", users.me);
router.get("/dashboard", isApiLoggedIn, wrapAsync(dashboard.show));
router.get("/bookings/me", isApiLoggedIn, wrapAsync(bookings.indexGuest));
router.get("/bookings/host", isApiLoggedIn, wrapAsync(bookings.indexHost));
router.patch("/bookings/:bookingId/cancel", isApiLoggedIn, wrapAsync(bookings.cancel));
router.post("/signup", validateApiSignup, wrapAsync(users.signup));
router.post("/login", users.login);
router.post("/logout", users.logout);
router.get(
    "/auth/google",
    requireGoogleOAuthConfig,
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/auth/google/callback",
    requireGoogleOAuthConfig,
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/listings");
    }
);

router.get("/wishlist", isApiLoggedIn, wrapAsync(wishlist.index));
router
    .route("/wishlist/:listingId")
    .post(isApiLoggedIn, wrapAsync(wishlist.add))
    .delete(isApiLoggedIn, wrapAsync(wishlist.remove));

router
    .route("/listings")
    .get(wrapAsync(listings.index))
    .post(
        isApiLoggedIn,
        upload.single("listing[image]"),
        validateApiListing,
        wrapAsync(listings.create)
    );

router
    .route("/listings/:id")
    .get(wrapAsync(listings.show))
    .put(
        isApiLoggedIn,
        wrapAsync(isApiOwner),
        upload.single("listing[image]"),
        validateApiListing,
        wrapAsync(listings.update)
    )
    .delete(
        isApiLoggedIn,
        wrapAsync(isApiOwner),
        wrapAsync(listings.destroy)
    );

router.post(
    "/listings/:id/bookings",
    isApiLoggedIn,
    validateApiBooking,
    wrapAsync(bookings.create)
);

router.post(
    "/listings/:id/reviews",
    isApiLoggedIn,
    validateApiReview,
    wrapAsync(reviews.create)
);

router.delete(
    "/listings/:id/reviews/:reviewId",
    isApiLoggedIn,
    wrapAsync(isApiReviewAuthor),
    wrapAsync(reviews.destroy)
);

module.exports = router;
