const passport = require("passport");
const User = require("../../models/user");

const serializeUser = (user) => {
    if (!user) {
        return null;
    }

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        wishlist: user.wishlist || [],
    };
};

module.exports.me = (req, res) => {
    res.json({ user: serializeUser(req.user) });
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({
            email,
            username,
            authProvider: "local",
            emailVerified: false,
        });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            return res.status(201).json({ user: serializeUser(registeredUser) });
        });
    } catch (err) {
        err.statusCode = 400;
        next(err);
    }
};

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                error: info && info.message ? info.message : "Invalid username or password.",
            });
        }

        req.login(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }

            return res.json({ user: serializeUser(user) });
        });
    })(req, res, next);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.json({ message: "Logged out." });
    });
};
