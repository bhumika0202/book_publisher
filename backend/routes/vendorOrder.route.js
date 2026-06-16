import express from "express";
import vendorOrderController from "../controllers/vendorOrder.controller.js";
import { checkUserRole } from "../middleware/role.middleware.js";

let vendorOrderRoute = express.Router();

vendorOrderRoute.get("/order-requests",checkUserRole([4]), vendorOrderController.orderRequestList);
/*
vendorOrderRoute.get("/completedOrder",checkUserRole([4]),vendorOrderController.completedOrders);
vendorOrderRoute.get("/pendingOrder",checkUserRole([4]),vendorOrderController.pendingOrder);
vendorOrderRoute.get("/ongoingOrder",checkUserRole([4]),vendorOrderController.ongoingOrder);
*/
vendorOrderRoute.put("/acceptOrder/:vendorOrderId",checkUserRole([4]), vendorOrderController.acceptPendingOrder);
vendorOrderRoute.put("/rejectOrder/:vendorOrderId",checkUserRole([4]), vendorOrderController.rejectPendingOrder);

vendorOrderRoute.put("/update-status/:vendorOrderId",checkUserRole([4]), vendorOrderController.updateOrderstatus);


export default vendorOrderRoute;