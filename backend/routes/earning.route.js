import express from "express";
import { checkUserRole } from "../middleware/role.middleware.js";
import earningController from "../controllers/earning.controller.js";

let earningRoute = express.Router();

earningRoute.get("/",checkUserRole([3, 4]),earningController.getEarning);

earningRoute.get("/available", checkUserRole([3, 4]), earningController.getAvailableAmount);

earningRoute.post("/withdraw", checkUserRole([3, 4]), earningController.withdrawRequest);

export default earningRoute;