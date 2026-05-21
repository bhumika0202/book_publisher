import { createCategory , categoryDelete, getAllCategory} from "../services/category.service.js";

let addCategory = async(req,res, next) => {
    try {
        let { name } = req.body;

        let result = await createCategory(name);
        res.status(200).json({message : "category added successfully", data : result})

    } catch (error) {
        next(error);
    }
}

let deleteCategory = async(req,res, next) => {
    try {
        let categoryId = Number(req.params.id);

        let result = await categoryDelete(categoryId);
        res.status(200).json({message : "category deleted successfully", data : result})

    } catch (error) {
        next(error);
    }
}

let getCategories = async(req,res, next) => {
    try {
        let result = await getAllCategory();
        res.status(200).json({message : "category fetched successfully", data : result});

    } catch (error) {
        next(error);
    }
}

export default {
    addCategory,
    deleteCategory,
    getCategories
}