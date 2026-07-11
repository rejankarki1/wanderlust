const mongoose = require("mongoose");

const connectDB = async (mongoUrl = process.env.ATLASDB_URL) => {
    if (!mongoUrl) {
        throw new Error("ATLASDB_URL is required to connect to MongoDB.");
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    await mongoose.connect(mongoUrl);
    return mongoose.connection;
};

const disconnectDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
};

module.exports = {
    connectDB,
    disconnectDB,
};
