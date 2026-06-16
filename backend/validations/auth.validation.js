import joi from "joi";

export const registerUserValidation = joi.object({
	name : joi.string().min(2).max(30).required().messages({
        "string.min" : "name must require 2 characters", 
        "string.max" : "max 30 char",
        "any.required" : "name is filled"
    }),
    email : joi.string().email().required().messages({
        "string.email" : "email must be well formatted",
        "any.required" : "email is required"
    }),
        password : joi.string().min(6).max(20).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must be at most 20 characters",
        "any.required": "Password is required",
    }),
    role : joi.string().required().messages({
        "any.required" : "role is required"
    })
});

export const loginUserValidation = joi.object({
    email : joi.string().email().required().messages({
        "string.email" : "email must be well formatted",
        "any.required" : "email is required"
    }),
    password : joi.string().min(6).max(20).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must be at most 20 characters",
        "any.required": "Password is required",
    })
});

export const otpValidation = joi.object({
    otp : joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        "string.length": "OTP must be exactly 6 digits",
        "string.pattern.base": "OTP must contain only numbers",
        "any.required": "OTP is required"
    })
});

export const sendOtpEmailValidation = joi.object({
    email : joi.string().email().required()
});

export const forgetPwdOtpValidation = joi.object({
    email : joi.string().email().required(), 
    otp : joi.string().length(6).pattern(/^[0-9]+$/).required(), 
    password : joi.string().min(6).max(20).required()
});

export const resetPwdValidation = joi.object({
    oldPwd : joi.string().min(6).max(20).required(),
    newPwd : joi.string().min(6).max(20).required()
});
