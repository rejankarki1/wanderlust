if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();

    if (process.env.ALLOW_INSECURE_TLS === "true") {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
}

const app = require("./app");
const { connectDB } = require("./config/db");

const port = process.env.PORT || 8080;

connectDB()
    .then(() => {
        console.log("connected to DB");
        app.listen(port, () => {
            console.log(`the server is listening to the port ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
