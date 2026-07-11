const Booking = require("../models/booking");
const {
    app,
    request,
    loginAgent,
    createListing,
    createBooking,
} = require("./helpers/apiTestUtils");

describe("Bookings API", () => {
    describe("POST /api/listings/:id/bookings", () => {
        it("rejects logged-out users", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner1" });
            const listing = await createListing(ownerSession.user._id);

            const res = await request(app)
                .post(`/api/listings/${listing._id}/bookings`)
                .send({
                    booking: {
                        checkIn: "2030-01-10",
                        checkOut: "2030-01-12",
                        guests: 2,
                    },
                })
                .expect(401);

            expect(res.body.error).toBe("You must be logged in.");
        });

        it("creates a confirmed booking for available dates", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner2" });
            const guestSession = await loginAgent({ username: "bookingguest2" });
            const listing = await createListing(ownerSession.user._id, { price: 150 });

            const res = await guestSession.agent
                .post(`/api/listings/${listing._id}/bookings`)
                .send({
                    booking: {
                        checkIn: "2030-02-10",
                        checkOut: "2030-02-13",
                        guests: 2,
                    },
                })
                .expect(201);

            expect(res.body.booking).toMatchObject({
                status: "confirmed",
                guests: 2,
                totalNights: 3,
                totalPrice: 450,
            });
            expect(res.body.booking.guest.username).toBe("bookingguest2");
            expect(res.body.booking.owner.username).toBe("bookingowner2");
        });

        it("rejects owners booking their own listing", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner3" });
            const listing = await createListing(ownerSession.user._id);

            const res = await ownerSession.agent
                .post(`/api/listings/${listing._id}/bookings`)
                .send({
                    booking: {
                        checkIn: "2030-03-10",
                        checkOut: "2030-03-12",
                        guests: 1,
                    },
                })
                .expect(400);

            expect(res.body.error).toBe("You cannot reserve your own listing.");
        });

        it("rejects guest counts above listing maxGuests", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner4" });
            const guestSession = await loginAgent({ username: "bookingguest4" });
            const listing = await createListing(ownerSession.user._id, { maxGuests: 2 });

            const res = await guestSession.agent
                .post(`/api/listings/${listing._id}/bookings`)
                .send({
                    booking: {
                        checkIn: "2030-04-10",
                        checkOut: "2030-04-12",
                        guests: 3,
                    },
                })
                .expect(400);

            expect(res.body.error).toBe("This listing allows up to 2 guests.");
        });

        it("rejects check-out dates that are not after check-in", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner5" });
            const guestSession = await loginAgent({ username: "bookingguest5" });
            const listing = await createListing(ownerSession.user._id);

            const res = await guestSession.agent
                .post(`/api/listings/${listing._id}/bookings`)
                .send({
                    booking: {
                        checkIn: "2030-05-10",
                        checkOut: "2030-05-10",
                        guests: 1,
                    },
                })
                .expect(400);

            expect(res.body.error).toBe("Check-out must be after check-in.");
        });

        it("rejects overlapping confirmed bookings", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner6" });
            const firstGuestSession = await loginAgent({ username: "bookingguest6a" });
            const secondGuestSession = await loginAgent({ username: "bookingguest6b" });
            const listing = await createListing(ownerSession.user._id);

            await createBooking({
                listingId: listing._id,
                guestId: firstGuestSession.user._id,
                ownerId: ownerSession.user._id,
                overrides: {
                    checkIn: new Date("2030-06-10T00:00:00.000Z"),
                    checkOut: new Date("2030-06-14T00:00:00.000Z"),
                },
            });

            const res = await secondGuestSession.agent
                .post(`/api/listings/${listing._id}/bookings`)
                .send({
                    booking: {
                        checkIn: "2030-06-12",
                        checkOut: "2030-06-15",
                        guests: 1,
                    },
                })
                .expect(409);

            expect(res.body.error).toBe("Those dates are already reserved.");
        });

        it("allows dates blocked only by cancelled bookings", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner7" });
            const firstGuestSession = await loginAgent({ username: "bookingguest7a" });
            const secondGuestSession = await loginAgent({ username: "bookingguest7b" });
            const listing = await createListing(ownerSession.user._id);

            await createBooking({
                listingId: listing._id,
                guestId: firstGuestSession.user._id,
                ownerId: ownerSession.user._id,
                overrides: {
                    checkIn: new Date("2030-07-10T00:00:00.000Z"),
                    checkOut: new Date("2030-07-14T00:00:00.000Z"),
                    status: "cancelled",
                },
            });

            await secondGuestSession.agent
                .post(`/api/listings/${listing._id}/bookings`)
                .send({
                    booking: {
                        checkIn: "2030-07-12",
                        checkOut: "2030-07-15",
                        guests: 1,
                    },
                })
                .expect(201);
        });
    });

    describe("GET /api/bookings/me", () => {
        it("returns bookings made by the logged-in guest", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner8" });
            const guestSession = await loginAgent({ username: "bookingguest8" });
            const listing = await createListing(ownerSession.user._id);
            await createBooking({
                listingId: listing._id,
                guestId: guestSession.user._id,
                ownerId: ownerSession.user._id,
            });

            const res = await guestSession.agent.get("/api/bookings/me").expect(200);

            expect(res.body.bookings).toHaveLength(1);
            expect(res.body.bookings[0].listing.title).toBe(listing.title);
        });
    });

    describe("GET /api/bookings/host", () => {
        it("returns bookings for listings owned by the logged-in owner", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner9" });
            const guestSession = await loginAgent({ username: "bookingguest9" });
            const listing = await createListing(ownerSession.user._id);
            await createBooking({
                listingId: listing._id,
                guestId: guestSession.user._id,
                ownerId: ownerSession.user._id,
            });

            const res = await ownerSession.agent.get("/api/bookings/host").expect(200);

            expect(res.body.bookings).toHaveLength(1);
            expect(res.body.bookings[0].guest.username).toBe("bookingguest9");
        });
    });

    describe("PATCH /api/bookings/:bookingId/cancel", () => {
        it("allows guests to cancel their own bookings", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner10" });
            const guestSession = await loginAgent({ username: "bookingguest10" });
            const listing = await createListing(ownerSession.user._id);
            const booking = await createBooking({
                listingId: listing._id,
                guestId: guestSession.user._id,
                ownerId: ownerSession.user._id,
            });

            const res = await guestSession.agent
                .patch(`/api/bookings/${booking._id}/cancel`)
                .expect(200);

            expect(res.body.booking.status).toBe("cancelled");
            expect(String(res.body.booking.cancelledBy)).toBe(String(guestSession.user._id));
        });

        it("allows owners to cancel bookings for their listings", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner11" });
            const guestSession = await loginAgent({ username: "bookingguest11" });
            const listing = await createListing(ownerSession.user._id);
            const booking = await createBooking({
                listingId: listing._id,
                guestId: guestSession.user._id,
                ownerId: ownerSession.user._id,
            });

            const res = await ownerSession.agent
                .patch(`/api/bookings/${booking._id}/cancel`)
                .expect(200);

            expect(res.body.booking.status).toBe("cancelled");
            expect(String(res.body.booking.cancelledBy)).toBe(String(ownerSession.user._id));
        });

        it("rejects unrelated users", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner12" });
            const guestSession = await loginAgent({ username: "bookingguest12" });
            const strangerSession = await loginAgent({ username: "bookingstranger12" });
            const listing = await createListing(ownerSession.user._id);
            const booking = await createBooking({
                listingId: listing._id,
                guestId: guestSession.user._id,
                ownerId: ownerSession.user._id,
            });

            const res = await strangerSession.agent
                .patch(`/api/bookings/${booking._id}/cancel`)
                .expect(403);

            expect(res.body.error).toBe("You do not have permission to cancel this booking.");
        });

        it("cancelled bookings no longer block new reservations", async () => {
            const ownerSession = await loginAgent({ username: "bookingowner13" });
            const guestSession = await loginAgent({ username: "bookingguest13" });
            const nextGuestSession = await loginAgent({ username: "bookingguest13b" });
            const listing = await createListing(ownerSession.user._id);
            const booking = await createBooking({
                listingId: listing._id,
                guestId: guestSession.user._id,
                ownerId: ownerSession.user._id,
                overrides: {
                    checkIn: new Date("2030-08-10T00:00:00.000Z"),
                    checkOut: new Date("2030-08-14T00:00:00.000Z"),
                },
            });

            await guestSession.agent.patch(`/api/bookings/${booking._id}/cancel`).expect(200);

            await nextGuestSession.agent
                .post(`/api/listings/${listing._id}/bookings`)
                .send({
                    booking: {
                        checkIn: "2030-08-11",
                        checkOut: "2030-08-13",
                        guests: 1,
                    },
                })
                .expect(201);

            const confirmedCount = await Booking.countDocuments({ listing: listing._id, status: "confirmed" });
            expect(confirmedCount).toBe(1);
        });
    });
});
