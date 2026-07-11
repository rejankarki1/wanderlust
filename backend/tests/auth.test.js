const {
    app,
    request,
    createUser,
} = require("./helpers/apiTestUtils");

describe("Auth API", () => {
    describe("GET /api/me", () => {
        it("returns null when no user is logged in", async () => {
            const res = await request(app).get("/api/me").expect(200);

            expect(res.body.user).toBeNull();
        });
    });

    describe("POST /api/signup", () => {
        it("creates a user and starts a session", async () => {
            const agent = request.agent(app);

            const res = await agent
                .post("/api/signup")
                .send({
                    username: "newuser",
                    email: "newuser@example.com",
                    password: "Password@123",
                })
                .expect(201);

            expect(res.body.user).toMatchObject({
                username: "newuser",
                email: "newuser@example.com",
                authProvider: "local",
            });

            const me = await agent.get("/api/me").expect(200);
            expect(me.body.user.username).toBe("newuser");
        });
    });

    describe("POST /api/login", () => {
        it("logs in with valid credentials", async () => {
            await createUser({ username: "loginuser", email: "login@example.com" });

            const res = await request(app)
                .post("/api/login")
                .send({ username: "loginuser", password: "Password@123" })
                .expect(200);

            expect(res.body.user.username).toBe("loginuser");
        });

        it("rejects invalid credentials", async () => {
            await createUser({ username: "badlogin", email: "badlogin@example.com" });

            const res = await request(app)
                .post("/api/login")
                .send({ username: "badlogin", password: "WrongPassword@123" })
                .expect(401);

            expect(res.body.error).toBeTruthy();
        });
    });

    describe("POST /api/logout", () => {
        it("logs out the active session", async () => {
            const agent = request.agent(app);
            await createUser({ username: "logoutuser", email: "logout@example.com" });

            await agent
                .post("/api/login")
                .send({ username: "logoutuser", password: "Password@123" })
                .expect(200);

            await agent.post("/api/logout").expect(200);

            const me = await agent.get("/api/me").expect(200);
            expect(me.body.user).toBeNull();
        });
    });
});
