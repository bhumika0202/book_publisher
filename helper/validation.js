import joi from "joi";

export const editQuantityValidation = joi.object({
    quantity : joi.number().required()
})

export const withdrowalValidation = joi.object({
    requestedAmount : joi.number().required()
});