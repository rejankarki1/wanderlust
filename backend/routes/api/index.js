const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudConfig");
const wrapAsync = require("../../utils/wrapAsync");
const listings = require("../../controllers/api/listings");
const reviews = require("../../controllers/api/reviews");
const users = require("../../controllers/api/users");
const {
    isApiLoggedIn,
    isApiOwner,
    isApiReviewAuthor,
    validateApiListing,
    validateApiReview,
} = require("./middleware");

const upload = multer({ storage });

router.get("/me", users.me);
router.post("/signup", wrapAsync(users.signup));
router.post("/login", users.login);
router.post("/logout", users.logout);

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
