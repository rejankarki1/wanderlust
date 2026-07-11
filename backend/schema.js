const Joi = require('joi');

const listingCategories = [
    "Trending",
    "Rooms",
    "Iconic Cities",
    "Mountains",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
    "Domes",
    "Boats",
];

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

module.exports.signupSchema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string()
        .pattern(passwordPattern)
        .required()
        .messages({
            "string.pattern.base": "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
        }),
});

// 1. Existing Listing Schema Validation
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0).max(5000),
        maxGuests: Joi.number().min(1).max(50).default(4),
        image: Joi.string().allow("", null),
        category: Joi.string().valid(...listingCategories).allow("", null),
    }).required()
});

// 2. NEW: Review Schema Validation
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        checkIn: Joi.string().isoDate().required(),
        checkOut: Joi.string().isoDate().required(),
        guests: Joi.number().integer().min(1).required(),
    }).required(),
});
