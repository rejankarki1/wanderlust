const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    googleId: {
        type: String,
        index: true,
        sparse: true,
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    avatar: String,
    emailVerified: {
        type: Boolean,
        default: false,
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing",
        },
    ],
});

// This automatically handles injecting username, hash, and salt fields!
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
