import { registerUser, sendLoginOtp, verifyLoginOtp, sendForgotPwdOtp, verifyForgetPwdOtp, resetPwd} from "../services/auth.service.js"
import { sendWelcomeMail } from "../services/email.service.js"

const register = async(req,res, next) => {
    try {
        let { name , email, password, role } = req.body;

        const user = await registerUser(name , email, password, role);
        await sendWelcomeMail(email, name);
        res.status(200).json({message : "registration successfully", data : user})
    }
     catch (error) {
        next(error);
    }
}

let sendOtpLogin = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        await sendLoginOtp(email,password);

        res.status(200).json({message : "otp sent successfully" });
    } catch (error) {
        next(error); 
    }
}

const verifyOtpLogin = async(req, res, next) => {
    try {
        const { email, otp } = req.body;
        const token = await verifyLoginOtp(email,otp);

        res.status(200).json({message : "login successfully", token });
    } catch (error) {
        next(error); 
    }
}

const sendOtpForgotPwd = async(req,res, next) => {
    try {
        await sendForgotPwdOtp(req.body.email);
        res.status(200).json({ message : "otp sent successfully"})
    } catch (error) {
        next(error);
    }
}

const verifyOtpForgotPwd = async(req,res, next) => {
    try {
        const { email, otp, password } = req.body
        await verifyForgetPwdOtp(email,otp,password);
        res.status(200).json({message : "password changed successfully"})
    } catch (error) {
        next(error);
    }
}

let resetPassword = async(req,res, next) => {
    try {
        let userId = req.user.userId;        
        const { oldPwd, newPwd } = req.body;
        
        await resetPwd(userId, oldPwd, newPwd);

        res.status(200).json({message : "password updated successfully"})
    } catch (error) {
        next(error);
    }
}

export default {
    register,
    sendOtpLogin,
    verifyOtpLogin,
    sendOtpForgotPwd,
    verifyOtpForgotPwd,
    resetPassword
}