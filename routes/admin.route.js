import express from "express";
import adminController from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {checkUserRole} from "../middleware/role.middleware.js";

let adminRoute = express.Router();

adminRoute.use( checkUserRole([1]));

// commission
adminRoute.post("/commission", adminController.setCommission);
adminRoute.put("/commission/:id/status", adminController.changeCommissionStatus);
adminRoute.get("/commission/getAll", adminController.getAllCommission);

// earnings
adminRoute.get("/earnings/total", adminController.viewEarning);
adminRoute.get("/earnings/users", adminController.viewUserEarning);

//role
adminRoute.post("/roles", adminController.addRole);
adminRoute.put("/roles/:roleId", adminController.editRole);
adminRoute.get("/roles", adminController.getRole);

//users
adminRoute.get("/user/", adminController.getAllUserList);
adminRoute.put("/user/:id", adminController.editUserInfo);
adminRoute.delete("/user/:id", adminController.deleteUserAccount);
adminRoute.put("/user/:id/status", adminController.editUserStatus);

//withdrawal request
adminRoute.get("/withdrawals", adminController.getwithdrawalRequest);
adminRoute.put("/withdrawals/:id/accept", adminController.acceptWithrawalReq);
adminRoute.put("/withdrawals/:id/reject", adminController.rejectWithdrawalReq);

export default adminRoute;