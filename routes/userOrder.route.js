import express from "express";
import { checkUserRole } from "../middleware/role.middleware.js";
import userOrderController from "../controllers/userOrder.controller.js"

let userOrderRoute = express.Router();

userOrderRoute.post("/",checkUserRole([2]),userOrderController.placeUserOrder);
userOrderRoute.get("/purchased-books",checkUserRole([2]),userOrderController.viewPurchasedBook);
userOrderRoute.get("/",checkUserRole([2]),userOrderController.viewOrderHistory)

export default userOrderRoute;

