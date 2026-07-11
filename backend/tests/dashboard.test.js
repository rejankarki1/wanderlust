const {
    loginAgent,
    createListing,
    createReview,
} = require("./helpers/apiTestUtils");

describe("Dashboard API", () => {
    describe("GET /api/dashboard", () => {
        it("rejects logged-out users", async () => {
            const { app, request } = require("./helpers/apiTestUtils");

            const res = await request(app).get("/api/dashboard").expect(401);

            expect(res.body.error).toBe("You must be logged in.");
        });

        it("returns owner listings, saved listings, and stats", async () => {
            const ownerSession = await loginAgent({ username: "dashboardowner" });
            const guestSession = await loginAgent({ username: "dashboardguest" });
            const ownedListing = await createListing(ownerSession.user._id, {
                title: "Owner Listing",
            });
            const savedListing = await createListing(guestSession.user._id, {
                title: "Saved Listing",
            });

            await createReview({
                listingId: ownedListing._id,
                authorId: guestSession.user._id,
                overrides: { rating: 4, comment: "Good stay." },
            });

            await ownerSession.agent.post(`/api/wishlist/${savedListing._id}`).expect(200);

            const res = await ownerSession.agent.get("/api/dashboard").expect(200);

            expect(res.body.user.username).toBe("dashboardowner");
            expect(res.body.ownedListings).toHaveLength(1);
            expect(res.body.savedListings).toHaveLength(1);
            expect(res.body.stats).toMatchObject({
                totalOwnedListings: 1,
                totalSavedListings: 1,
                totalReviewsReceived: 1,
                averageRating: 4,
            });
            expect(res.body.stats.highestRatedListing.title).toBe("Owner Listing");
        });
    });
});
