import express from "express";
import transactionController from "../controllers/transaction.controller.js"
import multerFile from "../utils/multer.js"
import { checkUserRole } from "../middleware/role.middleware.js";

let transactionRoute = express.Router();

transactionRoute.post("/pay/:orderId",checkUserRole([2,3]),multerFile.single("screenshot"),transactionController.makePayment);

transactionRoute.put("/status/:id", checkUserRole([1]), transactionController.editTransactionStatus)

transactionRoute.post("/bank", checkUserRole([1]), transactionController.addBankDetails);

transactionRoute.put("/bank/:id", checkUserRole([1]), transactionController.editBankDetails);

transactionRoute.get("/bank", checkUserRole([1,2,3,4]), transactionController.getBankDetails);

transactionRoute.get("/getAll", checkUserRole([1]), transactionController.getAllTransaction);

// transactionRoute.get("/totalAmount/:orderId", checkUserRole([2,3]), transactionController.checkTotalAmount)


export default transactionRoute;