import express from "express";
import dotenv from "dotenv";
import indexRoute from "./routes/index.route.js";
import errorHandler from "./middleware/error.middleware.js";

dotenv.config();

let app = express();
let port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use("/api",indexRoute);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`server is running on : http://localhost:${port}`);
});