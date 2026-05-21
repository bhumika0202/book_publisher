import express from "express";

import authRoute from "./auth.route.js";
import authMiddleWare from "../middleware/auth.middleware.js";
import categoryRoute from "./category.route.js";
import bookRoute from "./book.route.js";
import cartRoute from "./cart.route.js";
import userOrderRoute from "./userOrder.route.js";
import vendorCostRoute from "./vendorCost.route.js";
import vendorOrderRoute from "./vendorOrder.route.js";
import transactionRoute from "./transaction.route.js";
import earningRoute from "./earning.route.js";
import adminRoute from "./admin.route.js";

let indexRoute = express.Router();

indexRoute.use("/auth",authRoute);
indexRoute.use("/category", authMiddleWare, categoryRoute);
indexRoute.use("/book", authMiddleWare , bookRoute);

indexRoute.use("/cart", authMiddleWare, cartRoute);
indexRoute.use("/user/order", authMiddleWare, userOrderRoute);
indexRoute.use("/vendor-cost", authMiddleWare , vendorCostRoute);
indexRoute.use("/vendor/order", authMiddleWare, vendorOrderRoute);
indexRoute.use("/transaction", authMiddleWare , transactionRoute);
indexRoute.use("/earning", authMiddleWare, earningRoute);
indexRoute.use("/admin", authMiddleWare, adminRoute);

export default indexRoute;