const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();

  if (process.env.ALLOW_INSECURE_TLS === "true") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
}

const dbUrl = process.env.ATLASDB_URL;
const OWNER_ID = "6a32e3ce9d9ef202f6d7a530";
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  if (!dbUrl) {
    throw new Error("ATLASDB_URL is not defined");
  }

  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  const listingsWithOwner = await Promise.all(
    initData.data.map(async (listing) => {
      const response = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1,
      }).send();

      return {
        ...listing,
        owner: OWNER_ID,
        geometry: response.body.features[0].geometry,
      };
    })
  );

  await Listing.deleteMany({});
  await Listing.insertMany(listingsWithOwner);
  console.log("data was initialized");
};

initDB()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
