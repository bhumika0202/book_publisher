import joi from "joi";

export const createBookValidation = joi.object({
    title : joi.string().min(3).required(), 
    description : joi.string().min(10).required(),
    categoryId : joi.number().required()
});

export const createCategoryValidation = joi.object({
    name : joi.string().min(3).required()
})

export const printingCostValidation = joi.object({
    vendorId : joi.number().required(),
    quantity : joi.number().required(),
    totalPage : joi.number().required()
});

export const onlinePublishValdation = joi.object({
    price : joi.number().positive().required(), 
    keywords : joi.array().items(joi.string()).required()
});

export const offlinePublishValdation = joi.object({
    vendorId : joi.number().required(), 
    quantity : joi.number().required(),
    totalPage : joi.number().required(),
    address : joi.string().min(3).required()
})