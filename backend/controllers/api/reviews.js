const Listing = require("../../models/listing");
const Review = require("../../models/review");
const ExpressError = require("../../utils/ExpressError");

module.exports.create = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(new ExpressError(404, "Listing not found."));
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);

    await review.save();
    await listing.save();
    await review.populate("author", "username email");

    res.status(201).json({ review });
};

module.exports.destroy = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Review deleted." });
};
