const {
    app,
    request,
    loginAgent,
    createListing,
} = require("./helpers/apiTestUtils");

describe("Wishlist API", () => {
    describe("GET /api/wishlist", () => {
        it("rejects logged-out users", async () => {
            const res = await request(app).get("/api/wishlist").expect(401);

            expect(res.body.error).toBe("You must be logged in.");
        });

        it("returns the logged-in user's wishlist", async () => {
            const { agent, user } = await loginAgent({ username: "wishlistuser" });
            const listing = await createListing(user._id);

            await agent.post(`/api/wishlist/${listing._id}`).expect(200);

            const res = await agent.get("/api/wishlist").expect(200);

            expect(res.body.listings).toHaveLength(1);
            expect(res.body.listings[0]._id).toBe(String(listing._id));
        });
    });

    describe("POST /api/wishlist/:listingId", () => {
        it("adds a listing once even when called twice", async () => {
            const { agent, user } = await loginAgent({ username: "wishlistadd" });
            const listing = await createListing(user._id);

            await agent.post(`/api/wishlist/${listing._id}`).expect(200);
            const res = await agent.post(`/api/wishlist/${listing._id}`).expect(200);

            const wishlistIds = res.body.wishlist.map(String);
            expect(wishlistIds).toEqual([String(listing._id)]);
        });

        it("returns 404 for a missing listing", async () => {
            const { agent } = await loginAgent({ username: "wishlistmissing" });
            const missingId = "507f1f77bcf86cd799439011";

            const res = await agent.post(`/api/wishlist/${missingId}`).expect(404);

            expect(res.body.error).toBe("Listing not found.");
        });
    });

    describe("DELETE /api/wishlist/:listingId", () => {
        it("removes a listing from the wishlist", async () => {
            const { agent, user } = await loginAgent({ username: "wishlistremove" });
            const listing = await createListing(user._id);

            await agent.post(`/api/wishlist/${listing._id}`).expect(200);

            const res = await agent.delete(`/api/wishlist/${listing._id}`).expect(200);

            expect(res.body.wishlist.map(String)).not.toContain(String(listing._id));
        });
    });
});
