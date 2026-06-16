import express from "express";
import bookController from "../controllers/book.controller.js";
import multerFile from "../utils/multer.js";
import { checkPublishMode } from "../middleware/publishMode.middleware.js";
import { checkUserRole } from "../middleware/role.middleware.js";

const bookRoute = express.Router();

bookRoute.post("/", checkUserRole([2]), multerFile.fields([{ name: "content", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }, { name: "cover", maxCount: 1 }]), bookController.addBook);

bookRoute.put("/:bookId", checkUserRole([2]), multerFile.fields([{ name: "content", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }, { name: "cover", maxCount: 1 }]), bookController.editBook);

bookRoute.delete("/:bookId", checkUserRole([2,1]), bookController.deleteBook);

bookRoute.put("/:bookId/status", checkUserRole([2,1]), bookController.changeBookStatus);

bookRoute.post("/:bookId/publish", checkUserRole([2]), checkPublishMode,bookController.publishBook);

bookRoute.put("/:bookId/unpublish", checkUserRole([2,1]), bookController.unPublishBook);

bookRoute.post("/printing-quotations", checkUserRole([2]), bookController.printingQuatation);

bookRoute.get("/", checkUserRole([2,1]), bookController.getBookWithFilter);

bookRoute.get("/search", checkUserRole([2,1]), bookController.searchBook);

bookRoute.get("/:id", checkUserRole([2, 4, 1]), bookController.getBookDetails);

bookRoute.delete("/orders/delete/:id", checkUserRole([2]), bookController.deleteOrder);


export default bookRoute;