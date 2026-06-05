const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

const getImageUrl = (image) => {
    if (image && typeof image === "object") {
        return image.url || defaultImageUrl;
    }

    if (typeof image === "string") {
        const urlMatch = image.match(/url:\s*['"]([^'"]+)['"]/);
        return urlMatch ? urlMatch[1] : image;
    }

    return defaultImageUrl;
};

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        type: Schema.Types.Mixed,
        default: defaultImageUrl,
        get: getImageUrl,
        set: getImageUrl,
    },

    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
