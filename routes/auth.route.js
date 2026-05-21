import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

let authRoute = express.Router();

authRoute.post("/register",authController.register);

authRoute.post("/login/send-otp", authController.sendOtpLogin);
authRoute.post("/login/verify-otp", authController.verifyOtpLogin);

authRoute.post("/forgot-password/send-otp",authController.sendOtpForgotPwd);
authRoute.post("/forgot-password/verify-otp",authController.verifyOtpForgotPwd);

authRoute.post("/reset-password", authMiddleware, authController.resetPassword);

export default authRoute;