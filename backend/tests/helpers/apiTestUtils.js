const request = require("supertest");
const app = require("../../app");
const Listing = require("../../models/listing");
const Review = require("../../models/review");
const User = require("../../models/user");

let userCounter = 0;
let listingCounter = 0;

const createUser = async (overrides = {}) => {
    userCounter += 1;

    const password = overrides.password || "Password@123";
    const username = overrides.username || `testuser${userCounter}`;
    const user = new User({
        username,
        email: overrides.email || `${username}@example.com`,
        authProvider: overrides.authProvider || "local",
        emailVerified: overrides.emailVerified || false,
        avatar: overrides.avatar,
    });

    return User.register(user, password);
};

const loginAgent = async (overrides = {}) => {
    const password = overrides.password || "Password@123";
    const user = overrides.user || await createUser({ ...overrides, password });
    const agent = request.agent(app);

    await agent
        .post("/api/login")
        .send({ username: user.username, password })
        .expect(200);

    return { agent, user, password };
};

const createListing = async (ownerId, overrides = {}) => {
    listingCounter += 1;

    return Listing.create({
        title: overrides.title || `Test Listing ${listingCounter}`,
        description: overrides.description || "A listing created for API tests.",
        image: overrides.image || {
            url: "https://example.com/test-image.jpg",
            filename: `test-image-${listingCounter}`,
        },
        price: overrides.price ?? 120,
        maxGuests: overrides.maxGuests ?? 4,
        location: overrides.location || "Chicago",
        country: overrides.country || "United States",
        category: overrides.category || "Rooms",
        geometry: overrides.geometry || {
            type: "Point",
            coordinates: [-87.6298, 41.8781],
        },
        owner: ownerId,
        reviews: overrides.reviews || [],
    });
};

const createReview = async ({ listingId, authorId, overrides = {} }) => {
    const review = await Review.create({
        rating: overrides.rating || 5,
        comment: overrides.comment || "Excellent stay.",
        author: authorId,
    });

    await Listing.findByIdAndUpdate(listingId, {
        $push: { reviews: review._id },
    });

    return review;
};

module.exports = {
    app,
    request,
    createUser,
    loginAgent,
    createListing,
    createReview,
};
