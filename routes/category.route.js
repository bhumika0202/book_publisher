import express from "express";
import categoryController from "../controllers/category.controller.js";
import { checkUserRole } from "../middleware/role.middleware.js";

const categoryRoute = express.Router();

categoryRoute.post("/",checkUserRole([2]), categoryController.addCategory);

categoryRoute.delete("/:id",checkUserRole([1, 2]), categoryController.deleteCategory);

categoryRoute.get("/", categoryController.getCategories);

export default categoryRoute;