import { getUserEarning, availableWithdrawalAmount, addWithdrawRequest } from "../services/earning.service.js";

let getEarning = async(req, res, next) => {
    try {
        let userId = req.user.userId;
        let result = await getUserEarning(userId);
        
        res.status(200).json({message : "earning found successfully", data : result});
    } catch (error) {
        next(error);
    }
}

let getAvailableAmount = async(req, res, next) => {
    try {
        let userId = req.user.userId;
        let { availableAmount } = await availableWithdrawalAmount(userId);
        
        res.status(200).json({message : "Amount found successfully", data : availableAmount});
    } catch (error) {
        next(error);
    }
}

let withdrawRequest = async(req, res, next) => {
    try {
        let userId = req.user.userId;
        let requestedAmount = req.body.amount;
        let result = await addWithdrawRequest(userId, requestedAmount);
        
        res.status(201).json({message : "withdrowal requested successfully", data : result});
    } catch (error) {
        next(error);
    }
}



export default {
    getEarning,
    getAvailableAmount,
    withdrawRequest
}