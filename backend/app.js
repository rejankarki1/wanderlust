if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();

    if (process.env.ALLOW_INSECURE_TLS === "true") {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
}

const express = require("express");
const app = express();
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user.js");

const apiRouter = require("./routes/api");

const dbUrl = process.env.ATLASDB_URL;

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.set("trust proxy", 1);

const isTest = process.env.NODE_ENV === "test";
const store = isTest
    ? undefined
    : MongoStore.create({
        mongoUrl: dbUrl,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600,
    });

if (store) {
    store.on("error", (err) => {
        console.log("ERROR IN MONGO SESSION STORE", err);
    });
}

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    },
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

const buildGoogleUsername = async (profile) => {
    const emailPrefix = profile.emails?.[0]?.value?.split("@")[0];
    const displayName = profile.displayName || "google-user";
    const baseUsername = (emailPrefix || displayName)
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        || "google-user";

    let username = baseUsername;
    let suffix = 1;

    while (await User.findOne({ username })) {
        username = `${baseUsername}-${suffix}`;
        suffix += 1;
    }

    return username;
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase();
                const avatar = profile.photos?.[0]?.value;

                let user = await User.findOne({ googleId: profile.id });

                if (!user && email) {
                    user = await User.findOne({ email });
                }

                if (user) {
                    user.googleId = user.googleId || profile.id;
                    user.authProvider = user.authProvider || "google";
                    user.avatar = avatar || user.avatar;
                    user.emailVerified = true;
                    await user.save();
                    return done(null, user);
                }

                user = new User({
                    googleId: profile.id,
                    username: await buildGoogleUsername(profile),
                    email,
                    avatar,
                    authProvider: "google",
                    emailVerified: true,
                });

                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));
}

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api", apiRouter);

const clientDistPath = path.join(__dirname, "..", "client", "dist");

app.use(express.static(clientDistPath));

app.use((req, res, next) => {
    if (!["GET", "HEAD"].includes(req.method) || req.path.startsWith("/api")) {
        return next();
    }

    if (!req.accepts("html")) {
        return next();
    }

    return res.sendFile(path.join(clientDistPath, "index.html"));
});

// Error handling
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).json({ error: message });
});

module.exports = app;
