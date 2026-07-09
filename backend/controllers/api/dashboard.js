const Listing = require("../../models/listing");
const User = require("../../models/user");

const serializeUser = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    authProvider: user.authProvider,
    emailVerified: user.emailVerified,
});

const calculateListingRating = (listing) => {
    const reviews = listing.reviews || [];

    if (reviews.length === 0) {
        return {
            reviewCount: 0,
            averageRating: null,
        };
    }

    const ratingTotal = reviews.reduce((total, review) => total + Number(review.rating || 0), 0);

    return {
        reviewCount: reviews.length,
        averageRating: Number((ratingTotal / reviews.length).toFixed(1)),
    };
};

module.exports.show = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "wishlist",
        populate: {
            path: "owner",
            select: "username email",
        },
    });

    const ownedListings = await Listing.find({ owner: req.user._id })
        .populate("owner", "username email")
        .populate("reviews");

    const ownedListingsWithStats = ownedListings.map((listing) => {
        const listingObject = listing.toObject();
        const ratingStats = calculateListingRating(listingObject);

        return {
            ...listingObject,
            dashboardStats: ratingStats,
        };
    });

    const totalReviewsReceived = ownedListingsWithStats.reduce(
        (total, listing) => total + listing.dashboardStats.reviewCount,
        0
    );
    const totalRatingPoints = ownedListingsWithStats.reduce(
        (total, listing) => total + ((listing.dashboardStats.averageRating || 0) * listing.dashboardStats.reviewCount),
        0
    );
    const averageRating = totalReviewsReceived > 0
        ? Number((totalRatingPoints / totalReviewsReceived).toFixed(1))
        : null;
    const highestRatedListing = ownedListingsWithStats
        .filter((listing) => listing.dashboardStats.averageRating !== null)
        .sort((first, second) => second.dashboardStats.averageRating - first.dashboardStats.averageRating)[0] || null;

    res.json({
        user: serializeUser(user),
        ownedListings: ownedListingsWithStats,
        savedListings: user?.wishlist || [],
        stats: {
            totalOwnedListings: ownedListingsWithStats.length,
            totalSavedListings: user?.wishlist?.length || 0,
            totalReviewsReceived,
            averageRating,
            highestRatedListing,
        },
    });
};
