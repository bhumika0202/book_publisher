import prisma from "../config/db.config.js";
import { withdrowalValidation } from "../helper/validation.js";

export const getUserEarning = async(userId) => {
    try {
        let earning = await prisma.earning.findMany({
            where : { userId },
            select : {
                earningId : true,
                bookId : true,
                amount : true,
                commission : true,
                netAmount : true
            }
        });
        return earning;
        
    } catch (error) {
        throw error;
    }
}

export const availableWithdrawalAmount = async(userId) => {
    try {
        let earning = await prisma.earning.aggregate({
            where : {
                userId
            },
            _sum : {
                netAmount : true
            }
        })
        
        let withdrowedAmount = await prisma.withdrowal.aggregate({
            where : { 
                userId,
                status : {
                    not : "failed"
                }
            },
            _sum : {
                amountRequested : true
            }
        })
        const totalEarning = earning._sum.netAmount ?? 0;
        const totalWithdrowed = withdrowedAmount._sum.amountRequested ?? 0;

        const availableAmount = totalEarning - totalWithdrowed;

        return {availableAmount};

    } catch (error) {
        throw error;        
    }
}

export const addWithdrawRequest = async(userId, requestedAmount) => {
    try {
        let { error } = withdrowalValidation.validate({requestedAmount});
        if(error){
            throw error;
        }
        let { availableAmount } = await withdrowableAmount(userId);

        if(requestedAmount > availableAmount){
            throw new Error("Insufficient balance");
        }
        let earning = await prisma.withdrowal.create({
            data : {
                userId,
                amountRequested : requestedAmount
            }
        })
        return earning;
    } catch (error) {
        throw error;
    }
}

