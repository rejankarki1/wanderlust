if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();

    if (process.env.ALLOW_INSECURE_TLS === "true") {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require ("express-session");
const { MongoStore } = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const apiRouter = require("./routes/api");


const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
}) 
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.use(express.json());
app.use(express.urlencoded({extended : true}));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

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

app.listen(8080, () => {
    console.log("the server is listening to the port 8080");
});
