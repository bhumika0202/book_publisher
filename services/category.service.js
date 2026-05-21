import prisma from "../config/db.config.js"
import { createCategoryValidation } from "../validations/book.validation.js";


export const createCategory = async(name) => {
    try {
        let { error } =  createCategoryValidation.validate({name});
        if(error) {
            throw error;
        }
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive"
                }
            }
        });
        if (existingCategory) {
            throw new Error("Category already exists");
        }
        return await prisma.category.create({
            data : { name }
        });

    } catch (error) {
        throw error;
    }
}

export const categoryDelete = async(categoryId) => {
    try {
        const existingCategory = await prisma.category.findFirst({
            where: { categoryId }
        });
        if (!existingCategory) {
            throw new Error("Category not found");
        }
        return await prisma.category.delete({
            where : { categoryId }
        });

    } catch (error) {
        throw error;
    }
}

export const getAllCategory = async() => {
    try {
        return await prisma.category.findMany();
    } catch (error) {
        throw error;
    }
}
