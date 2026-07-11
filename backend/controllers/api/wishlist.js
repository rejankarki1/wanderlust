const Listing = require("../../models/listing");
const User = require("../../models/user");
const ExpressError = require("../../utils/ExpressError");

module.exports.index = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "wishlist",
        populate: {
            path: "owner",
            select: "username email",
        },
    });

    res.json({ listings: user?.wishlist || [] });
};

module.exports.add = async (req, res, next) => {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);

    if (!listing) {
        return next(new ExpressError(404, "Listing not found."));
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: listingId } },
        { returnDocument: "after" }
    );

    res.json({ wishlist: user.wishlist });
};

module.exports.remove = async (req, res) => {
    const { listingId } = req.params;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: listingId } },
        { returnDocument: "after" }
    );

    res.json({ wishlist: user.wishlist });
};
