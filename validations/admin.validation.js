import joi from "joi";

export const createCommissionValidation = joi.object({
    commissionType : joi.string().required(), 
    value : joi.number().required()
});

export const userRoleValidation = joi.object({
    roleName : joi.string().required()
});

export const editUserValidation = joi.object({
    name : joi.string().min(2).required(),
    email : joi.string().email().required()
});

export const editUserPwdValidation = joi.object({
    password : joi.string().min(6).max(20).required()
});

export const bankDetailsValidation = joi.object({
    accountHolder: joi.string().min(2).required(),
    bankName: joi.string().min(2).required(),
    accountNumber: joi.string().pattern(/^[0-9]{9,18}$/).required(),  // bank account number (9–18 digits)
    ifscCode: joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).required(),  // IFSC format
    upiId: joi.string().pattern(/^[\w.-]+@[\w.-]+$/).required()  // UPI ID format
});