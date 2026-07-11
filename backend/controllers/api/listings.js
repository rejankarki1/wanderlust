const Listing = require("../../models/listing");
const Review = require("../../models/review");
const User = require("../../models/user");
const ExpressError = require("../../utils/ExpressError");
const { cloudinary } = require("../../cloudConfig");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

const deleteCloudinaryImage = async (filename) => {
    if (!filename) {
        return;
    }

    const result = await cloudinary.uploader.destroy(filename);

    if (result.result && !["ok", "not found"].includes(result.result)) {
        throw new ExpressError(502, "Could not delete listing image from Cloudinary.");
    }
};

const buildListingFilters = (query) => {
    const { category, search, where, guests } = query;
    const filters = {};
    const destination = where || search;

    if (category) {
        filters.category = category;
    }

    if (destination) {
        filters.$or = [
            { title: { $regex: destination, $options: "i" } },
            { location: { $regex: destination, $options: "i" } },
            { country: { $regex: destination, $options: "i" } },
        ];
    }

    const guestCount = Number(guests);

    if (Number.isFinite(guestCount) && guestCount > 0) {
        filters.$and = [
            {
                $or: [
                    { maxGuests: { $gte: guestCount } },
                    { maxGuests: { $exists: false } },
                    { maxGuests: null },
                ],
            },
        ];
    }

    return filters;
};

const findListings = async (query) => {
    const filters = buildListingFilters(query);
    const requestedPage = Number.parseInt(query.page, 10);
    const requestedLimit = Number.parseInt(query.limit, 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 48) : 12;
    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
        Listing.find(filters)
            .populate("owner", "username email")
            .skip(skip)
            .limit(limit),
        Listing.countDocuments(filters),
    ]);

    return {
        listings,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(Math.ceil(total / limit), 1),
        },
    };
};

const geocodeLocation = async (location) => {
    const response = await geocodingClient.forwardGeocode({
        query: location,
        limit: 1,
    }).send();

    const feature = response.body.features[0];

    if (!feature || !feature.geometry) {
        throw new ExpressError(400, "Could not find coordinates for that location.");
    }

    return feature.geometry;
};

module.exports.index = async (req, res) => {
    const { listings, pagination } = await findListings(req.query);
    res.json({ listings, pagination });
};

module.exports.show = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                select: "username email",
            },
        })
        .populate("owner", "username email");

    if (!listing) {
        return next(new ExpressError(404, "Listing not found."));
    }

    res.json({ listing, mapToken: process.env.MAP_TOKEN });
};

module.exports.create = async (req, res, next) => {
    if (!req.file) {
        return next(new ExpressError(400, "Please upload an image."));
    }

    const listing = new Listing(req.body.listing);
    listing.geometry = await geocodeLocation(req.body.listing.location);
    listing.owner = req.user._id;
    listing.image = {
        url: req.file.path,
        filename: req.file.filename,
    };

    await listing.save();
    await listing.populate("owner", "username email");

    res.status(201).json({ listing });
};

module.exports.update = async (req, res) => {
    const currentListing = req.listing || await Listing.findById(req.params.id);
    const nextListing = { ...req.body.listing };
    const oldImageFilename = currentListing.image?.filename;

    if (nextListing.location && nextListing.location !== currentListing.location) {
        nextListing.geometry = await geocodeLocation(nextListing.location);
    }

    const listing = await Listing.findByIdAndUpdate(
        req.params.id,
        nextListing,
        {
            returnDocument: "after",
            runValidators: true,
        }
    ).populate("owner", "username email");

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await listing.save();
        await deleteCloudinaryImage(oldImageFilename);
    }

    res.json({ listing });
};

module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    const listing = req.listing || await Listing.findById(id);

    if (listing && listing.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }

    await deleteCloudinaryImage(listing?.image?.filename);
    await Listing.findByIdAndDelete(id);
    await User.updateMany({ wishlist: id }, { $pull: { wishlist: id } });
    res.json({ message: "Listing deleted." });
};
