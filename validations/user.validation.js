import joi from "joi";

export const createTransactionValidation = joi.object({
    paymentMethod : joi.string().required(), 
    referenceId : joi.string().required()
});

export const vendorCostValidation = joi.object({
    costPerPage : joi.number().required()
});