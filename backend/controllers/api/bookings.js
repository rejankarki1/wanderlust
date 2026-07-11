const Booking = require("../../models/booking");
const Listing = require("../../models/listing");
const ExpressError = require("../../utils/ExpressError");

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const populateBooking = (query) => query
    .populate("listing", "title image location country price maxGuests owner")
    .populate("guest", "username email")
    .populate("owner", "username email");

const parseDateOnly = (value) => {
    const datePart = String(value).slice(0, 10);
    const date = new Date(`${datePart}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
        throw new ExpressError(400, "Invalid booking dates.");
    }

    return date;
};

const calculateNights = (checkIn, checkOut) => {
    return Math.round((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY);
};

const findOverlappingBooking = async ({ listingId, checkIn, checkOut, excludeBookingId }) => {
    const filters = {
        listing: listingId,
        status: "confirmed",
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
    };

    if (excludeBookingId) {
        filters._id = { $ne: excludeBookingId };
    }

    return Booking.findOne(filters);
};

module.exports.indexGuest = async (req, res) => {
    const bookings = await populateBooking(
        Booking.find({ guest: req.user._id }).sort({ checkIn: 1, createdAt: -1 })
    );

    res.json({ bookings });
};

module.exports.indexHost = async (req, res) => {
    const bookings = await populateBooking(
        Booking.find({ owner: req.user._id }).sort({ checkIn: 1, createdAt: -1 })
    );

    res.json({ bookings });
};

module.exports.create = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(new ExpressError(404, "Listing not found."));
    }

    if (listing.owner?.equals(req.user._id)) {
        return next(new ExpressError(400, "You cannot reserve your own listing."));
    }

    const { checkIn: checkInValue, checkOut: checkOutValue, guests } = req.body.booking;
    const checkIn = parseDateOnly(checkInValue);
    const checkOut = parseDateOnly(checkOutValue);
    const totalNights = calculateNights(checkIn, checkOut);

    if (totalNights < 1) {
        return next(new ExpressError(400, "Check-out must be after check-in."));
    }

    if (guests > listing.maxGuests) {
        return next(new ExpressError(400, `This listing allows up to ${listing.maxGuests} guests.`));
    }

    const overlappingBooking = await findOverlappingBooking({
        listingId: listing._id,
        checkIn,
        checkOut,
    });

    if (overlappingBooking) {
        return next(new ExpressError(409, "Those dates are already reserved."));
    }

    const booking = await Booking.create({
        listing: listing._id,
        guest: req.user._id,
        owner: listing.owner,
        checkIn,
        checkOut,
        guests,
        totalNights,
        totalPrice: totalNights * Number(listing.price || 0),
        status: "confirmed",
    });

    await booking.populate([
        { path: "listing", select: "title image location country price maxGuests owner" },
        { path: "guest", select: "username email" },
        { path: "owner", select: "username email" },
    ]);

    res.status(201).json({ booking });
};

module.exports.cancel = async (req, res, next) => {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
        return next(new ExpressError(404, "Booking not found."));
    }

    const isGuest = booking.guest.equals(req.user._id);
    const isOwner = booking.owner.equals(req.user._id);

    if (!isGuest && !isOwner) {
        return next(new ExpressError(403, "You do not have permission to cancel this booking."));
    }

    if (booking.status !== "cancelled") {
        booking.status = "cancelled";
        booking.cancelledAt = new Date();
        booking.cancelledBy = req.user._id;
        await booking.save();
    }

    await booking.populate([
        { path: "listing", select: "title image location country price maxGuests owner" },
        { path: "guest", select: "username email" },
        { path: "owner", select: "username email" },
    ]);

    res.json({ booking });
};

module.exports.cancelForListing = async (listingId, userId) => {
    await Booking.updateMany(
        { listing: listingId, status: "confirmed" },
        {
            status: "cancelled",
            cancelledAt: new Date(),
            cancelledBy: userId,
        }
    );
};
