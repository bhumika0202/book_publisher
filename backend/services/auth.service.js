import prisma from "../config/db.config.js";
import  { registerUserValidation, loginUserValidation, otpValidation, sendOtpEmailValidation, forgetPwdOtpValidation, resetPwdValidation}  from "../validations/auth.validation.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { otpMail , forgetPwdEmail} from "../services/email.service.js"
import generateOTP from "../utils/generateOtp.js";


export let registerUser = async( name , email, password, role) => {
    try {
        if (role.toLowerCase() === "admin" ) {
            throw new Error("can not register as admin");
        }

        const { error } =  registerUserValidation.validate({name , email, password, role});
        if (error) { throw error; }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("User already exists");
        }

        let hashedpwd = await bcrypt.hash(password,10);

        let findRole = await prisma.role.findUnique({
            where : { roleName : role }
        }); 
    
        return await prisma.user.create({
            data : {
                name,
                email,
                password : hashedpwd,
                roleId : findRole.roleId
            }
        })
    } catch (error) {
        throw error;
    }
}

export let sendLoginOtp = async(email,password) => {
    const { error } = loginUserValidation.validate({email,password});

    if(error){
        throw new Error(error.details[0].message);
    }
    let findUser = await prisma.user.findUnique({
        where : { email }
    });

    if (!findUser) {
        throw new Error("User with this email not found");
    }
    
    const comparePwd = await bcrypt.compare(password,findUser.password);
    
    if(!comparePwd){
        throw new Error("password doesn't match");
    }
    
    let otp = generateOTP();
    console.log("OTP : ", otp);

    let hashedOtp = await bcrypt.hash(otp,10);
    await prisma.user.update({
        where : {
            userId : findUser.userId
        },
        data : {
            otp : hashedOtp,
            otpExpiry : new Date(Date.now() + 10 * 60 * 1000)
        }
    });

    await otpMail(email,otp);
}

export const verifyLoginOtp = async(email,otp) => {
    const { error } = otpValidation.validate({otp});

    if(error){
        throw error;
    }   

    let findUser = await prisma.user.findUnique({
        where : { email }
    });

    if(!findUser){
        throw new Error("User Email doesn't exist");
    }

    if (findUser.otpExpiry < new Date()) {
        throw new Error("OTP expired");
    }
    // if (findUser.otp !== otp) {
    //     throw new Error("Invalid OTP");
    // }
    const compareOtp = await bcrypt.compare(otp,findUser.otp);
    if(!compareOtp){
        throw new Error("Invalid OTP");
    }
    await prisma.user.update({
        where : {
            userId : findUser.userId
        },
        data : {
            otp : null,
            otpExpiry : null,
            isVarified : true
        }
    });

    const payload = { userId: findUser.userId , role: findUser.roleId };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY,{ expiresIn : "2h" });

    return token;

}

export const sendForgotPwdOtp = async(email) => {
    try {
        let { error } = sendOtpEmailValidation.validate({email});
        if(error) {
            throw error;
        }

        let findUser = await prisma.user.findUnique({
            where : { email }
        });
        
        if (!findUser) {
           throw new Error("User with this email not found");
        }
        
        let otp = generateOTP();
        console.log("OTP : ", otp);
        let hashedOtp = await bcrypt.hash(otp,10);
        await prisma.user.update({
            where : {
                userId : findUser.userId
            },
            data : {
                otp : hashedOtp,
                otpExpiry : new Date(Date.now() + 10 * 60 * 1000)
            }
        });
        await forgetPwdEmail(email,otp);
        
    } catch (error) {
        throw error;
    }
}

export const verifyForgetPwdOtp = async(email,otp, password) => {
    try {

        let { error } = forgetPwdOtpValidation.validate({email, otp, password});
        if(error){
            throw error;
        }

        let findUser = await prisma.user.findUnique({
            where : {email}
        });
        if(!findUser) {
            throw new Error("User not found");  
        }

        if (findUser.otpExpiry < new Date()) {
            throw new Error("OTP expired");
        }

        await bcrypt.compare(otp, findUser.otp);
        
        let hashedpwd = await bcrypt.hash(password,10);
        
        await prisma.user.update({
            where : {
                userId : findUser.userId
            },
            data : {
                otp : null,
                otpExpiry : null,
                password : hashedpwd
            }
        });
        
    } catch (error) {
        throw error;
    }
}

export const resetPwd = async(userId, oldPwd, newPwd) => {
    try {
        let { error } = resetPwdValidation.validate({oldPwd, newPwd});
        if(error) {
            throw error
        }
        let user = await prisma.user.findUnique({
            where : {userId}
        });
        if (!user) {throw new Error("User not found");}

        let comparePwd = await bcrypt.compare(newPwd,user.password);
        if (comparePwd) {
            throw new Error("New password cannot be same as old password");
        }
        let hashPwd = await bcrypt.hash(newPwd,10);

        await prisma.user.update({
            where : {userId},
            data : {
                password : hashPwd
            }
        })
    } catch (error) {
        throw error;
    }
}