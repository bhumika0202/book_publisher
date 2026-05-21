import express from "express";
import vendorCostController from "../controllers/vendorCost.controller.js";
import { checkUserRole } from "../middleware/role.middleware.js";

let vendorCostRoute = express.Router();

vendorCostRoute.post("/",checkUserRole([3]), vendorCostController.addCost);

vendorCostRoute.put("/:id", checkUserRole([3]), vendorCostController.updateVendorCost);

vendorCostRoute.get("/", checkUserRole([1,2,3]), vendorCostController.getCost);

export default vendorCostRoute;