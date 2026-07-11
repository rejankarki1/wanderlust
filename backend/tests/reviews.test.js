const Review = require("../models/review");
const {
    app,
    request,
    loginAgent,
    createListing,
    createReview,
} = require("./helpers/apiTestUtils");

describe("Reviews API", () => {
    describe("POST /api/listings/:id/reviews", () => {
        it("allows logged-in users to create reviews", async () => {
            const ownerSession = await loginAgent({ username: "reviewowner" });
            const guestSession = await loginAgent({ username: "reviewguest" });
            const listing = await createListing(ownerSession.user._id);

            const res = await guestSession.agent
                .post(`/api/listings/${listing._id}/reviews`)
                .send({
                    review: {
                        rating: 5,
                        comment: "Great place.",
                    },
                })
                .expect(201);

            expect(res.body.review).toMatchObject({
                rating: 5,
                comment: "Great place.",
            });
            expect(res.body.review.author.username).toBe("reviewguest");
        });

        it("rejects logged-out users", async () => {
            const ownerSession = await loginAgent({ username: "loggedoutreviewowner" });
            const listing = await createListing(ownerSession.user._id);

            const res = await request(app)
                .post(`/api/listings/${listing._id}/reviews`)
                .send({
                    review: {
                        rating: 4,
                        comment: "Nice.",
                    },
                })
                .expect(401);

            expect(res.body.error).toBe("You must be logged in.");
        });

        it("returns 404 when the listing does not exist", async () => {
            const { agent } = await loginAgent({ username: "missinglistingreview" });
            const missingId = "507f1f77bcf86cd799439011";

            const res = await agent
                .post(`/api/listings/${missingId}/reviews`)
                .send({
                    review: {
                        rating: 4,
                        comment: "Nice.",
                    },
                })
                .expect(404);

            expect(res.body.error).toBe("Listing not found.");
        });
    });

    describe("DELETE /api/listings/:id/reviews/:reviewId", () => {
        it("allows review authors to delete their reviews", async () => {
            const ownerSession = await loginAgent({ username: "deleteReviewOwner" });
            const guestSession = await loginAgent({ username: "deleteReviewGuest" });
            const listing = await createListing(ownerSession.user._id);
            const review = await createReview({
                listingId: listing._id,
                authorId: guestSession.user._id,
            });

            await guestSession.agent
                .delete(`/api/listings/${listing._id}/reviews/${review._id}`)
                .expect(200);

            const deletedReview = await Review.findById(review._id);
            expect(deletedReview).toBeNull();
        });

        it("rejects users who are not the review author", async () => {
            const ownerSession = await loginAgent({ username: "otherReviewOwner" });
            const guestSession = await loginAgent({ username: "otherReviewGuest" });
            const strangerSession = await loginAgent({ username: "otherReviewStranger" });
            const listing = await createListing(ownerSession.user._id);
            const review = await createReview({
                listingId: listing._id,
                authorId: guestSession.user._id,
            });

            const res = await strangerSession.agent
                .delete(`/api/listings/${listing._id}/reviews/${review._id}`)
                .expect(403);

            expect(res.body.error).toBe("You do not have permission to delete this review.");
        });
    });
});
