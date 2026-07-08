const Listing = require("../../models/listing");
const Review = require("../../models/review");
const ExpressError = require("../../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../../schema");

module.exports.isApiLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(new ExpressError(401, "You must be logged in."));
    }

    next();
};

module.exports.validateApiListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }

    next();
};

module.exports.validateApiReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }

    next();
};

module.exports.isApiOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        return next(new ExpressError(404, "Listing not found."));
    }

    if (!listing.owner || !listing.owner.equals(req.user._id)) {
        return next(new ExpressError(403, "You do not have permission to modify this listing."));
    }

    req.listing = listing;
    next();
};

module.exports.isApiReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        return next(new ExpressError(404, "Review not found."));
    }

    if (!review.author || !review.author.equals(req.user._id)) {
        return next(new ExpressError(403, "You do not have permission to delete this review."));
    }

    req.review = review;
    next();
};
