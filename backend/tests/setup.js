process.env.NODE_ENV = "test";
process.env.SECRET = "test-secret";
process.env.MAP_TOKEN = "test-map-token";
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_KEY = "test-key";
process.env.CLOUDINARY_API_SECRET = "test-secret";

jest.mock("@mapbox/mapbox-sdk/services/geocoding", () => {
    return () => ({
        forwardGeocode: () => ({
            send: async () => ({
                body: {
                    features: [
                        {
                            geometry: {
                                type: "Point",
                                coordinates: [-87.6298, 41.8781],
                            },
                        },
                    ],
                },
            }),
        }),
    });
});

jest.mock("../cloudConfig", () => ({
    cloudinary: {
        uploader: {
            destroy: jest.fn().mockResolvedValue({ result: "ok" }),
        },
    },
    storage: {
        _handleFile: jest.fn(),
        _removeFile: jest.fn(),
    },
}));

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
    const collections = Object.values(mongoose.connection.collections);

    await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
});
