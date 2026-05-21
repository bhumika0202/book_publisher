import express from "express";
import { checkUserRole } from "../middleware/role.middleware.js";
import cartController from "../controllers/cart.controller.js"

let cartRoute = express.Router();

cartRoute.post("/add/:bookId",checkUserRole([2]),cartController.addToCart);
cartRoute.put("/quantity/:cartId",checkUserRole([2]),cartController.editQuantity);

cartRoute.get("/",checkUserRole([2]),cartController.viewCart);
cartRoute.delete("/delete/:id",checkUserRole([2]),cartController.deleteCartItem);

cartRoute.delete("/all", checkUserRole([2]), cartController.deleteAllCartItems);

export default cartRoute;