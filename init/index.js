const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const OWNER_ID = "6a32e3ce9d9ef202f6d7a530";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const listingsWithOwner = initData.data.map((listing) => ({
    ...listing,
    owner: OWNER_ID,
  }));
  await Listing.insertMany(listingsWithOwner);
  console.log("data was initialized");
};

initDB()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
