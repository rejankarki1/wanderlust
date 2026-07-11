const User = require("../models/user");
const Review = require("../models/review");
const {
    app,
    request,
    loginAgent,
    createListing,
    createReview,
} = require("./helpers/apiTestUtils");

describe("Listings API", () => {
    describe("GET /api/listings", () => {
        it("returns listings with pagination", async () => {
            const { user } = await loginAgent();
            await createListing(user._id, { title: "Lake House" });
            await createListing(user._id, { title: "City Loft" });

            const res = await request(app).get("/api/listings").expect(200);

            expect(res.body.listings).toHaveLength(2);
            expect(res.body.pagination).toMatchObject({
                page: 1,
                limit: 12,
                total: 2,
                totalPages: 1,
            });
        });

        it("filters by destination search", async () => {
            const { user } = await loginAgent();
            await createListing(user._id, { title: "Mountain Cabin", location: "Denver" });
            await createListing(user._id, { title: "Beach Condo", location: "Miami" });

            const res = await request(app).get("/api/listings?where=Denver").expect(200);

            expect(res.body.listings).toHaveLength(1);
            expect(res.body.listings[0].location).toBe("Denver");
        });
    });

    describe("GET /api/listings/:id", () => {
        it("returns one listing with owner and map token", async () => {
            const { user } = await loginAgent();
            const listing = await createListing(user._id);

            const res = await request(app).get(`/api/listings/${listing._id}`).expect(200);

            expect(res.body.listing._id).toBe(String(listing._id));
            expect(res.body.listing.owner.username).toBe(user.username);
            expect(res.body.mapToken).toBe("test-map-token");
        });

        it("returns 404 for a missing listing", async () => {
            const missingId = "507f1f77bcf86cd799439011";

            const res = await request(app).get(`/api/listings/${missingId}`).expect(404);

            expect(res.body.error).toBe("Listing not found.");
        });
    });

    describe("POST /api/listings", () => {
        it("rejects unauthenticated users", async () => {
            const res = await request(app)
                .post("/api/listings")
                .field("listing[title]", "No Session")
                .expect(401);

            expect(res.body.error).toBe("You must be logged in.");
        });
    });

    describe("PUT /api/listings/:id", () => {
        it("rejects non-owners", async () => {
            const ownerSession = await loginAgent({ username: "owner" });
            const strangerSession = await loginAgent({ username: "stranger" });
            const listing = await createListing(ownerSession.user._id);

            const res = await strangerSession.agent
                .put(`/api/listings/${listing._id}`)
                .send({
                    listing: {
                        title: "Updated",
                        description: "Updated description",
                        location: "Chicago",
                        country: "United States",
                        price: 150,
                        maxGuests: 4,
                        category: "Rooms",
                    },
                })
                .expect(403);

            expect(res.body.error).toBe("You do not have permission to modify this listing.");
        });
    });

    describe("DELETE /api/listings/:id", () => {
        it("rejects non-owners", async () => {
            const ownerSession = await loginAgent({ username: "ownerdelete" });
            const strangerSession = await loginAgent({ username: "strangerdelete" });
            const listing = await createListing(ownerSession.user._id);

            const res = await strangerSession.agent
                .delete(`/api/listings/${listing._id}`)
                .expect(403);

            expect(res.body.error).toBe("You do not have permission to modify this listing.");
        });

        it("deletes owned listings, related reviews, and wishlist references", async () => {
            const ownerSession = await loginAgent({ username: "deleteowner" });
            const guestSession = await loginAgent({ username: "deleteguest" });
            const listing = await createListing(ownerSession.user._id);
            const review = await createReview({
                listingId: listing._id,
                authorId: guestSession.user._id,
            });

            await User.findByIdAndUpdate(guestSession.user._id, {
                $addToSet: { wishlist: listing._id },
            });

            await ownerSession.agent.delete(`/api/listings/${listing._id}`).expect(200);

            const deletedReview = await Review.findById(review._id);
            const guest = await User.findById(guestSession.user._id);

            expect(deletedReview).toBeNull();
            expect(guest.wishlist.map(String)).not.toContain(String(listing._id));
        });
    });
});
