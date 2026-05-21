import prisma from "../config/db.config.js"
import { vendorCostValidation } from "../validations/user.validation.js";

export const vendorCost = async(vendorId, costPerPage) => {
    try {
        let { error } = vendorCostValidation.validate({costPerPage});
        if(error) {
            throw error;
        }
        let existing = await prisma.vendorCost.findFirst({
            where : { vendorId }
        });
        
        if(existing){
            throw new Error("Cost already added");
        }
        return await prisma.vendorCost.create({ 
            data : {
                vendorId,
                costPerPage
            }
        });
    } catch (error) {
        throw error;
    }
}

export const updateCost = async(userId,vendorCostId,costPerPage) => {
    try {
        let { error } = vendorCostValidation.validate({costPerPage});
        if(error) {
            throw error;
        }
        let existing = await prisma.vendorCost.findFirst({
            where : { vendorCostId , vendorId : userId}
        });
        // let existingg = await prisma.vendorCost.findFirst({
        //     where : { vendorCostId }
        // });
        if(!existing){
            throw new Error("Cost not found for this user");
        }
        return await prisma.vendorCost.update({ 
            where : {vendorId : userId},
            data : {
                costPerPage
            }
        });
    } catch (error) {
        throw error;
    }
}

export const getVendorCost = async(vendorId, userRole) => {
    if(userRole === 1){
        return await prisma.vendorCost.findMany();
    }
    else{
        return await prisma.vendorCost.findFirst({
            where: { vendorId }
        });
    }
};