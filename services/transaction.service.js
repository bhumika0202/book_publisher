import prisma from "../config/db.config.js"
import { createTransactionValidation } from "../validations/user.validation.js";
import cloudinaryFile from "../utils/cloudinary.js"
import { paymentMail, paymentStatusEmail} from "./email.service.js"
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// export const getTotalAmount = async(userRole, orderId) => {

//     let order = {};
//     if(userRole === "author"){
//         userRole = "Author";
//         order = await prisma.vendorOrder.findUnique({
//             where: { vendorOrderId : orderId }
//         });

//         if (!order) {
//             throw new Error("Order not found");
//         }
//     }      

//     if(userRole === "user"){
//         order = await prisma.userOrder.findUnique({
//             where: { userOrderId : orderId}
//         });
        
//         if (!order) {
//             throw new Error("Order not found");
//         }
//         userRole = "User";
//     }  

//     let findrole = await prisma.role.findFirst({
//         where : {roleName : userRole}
//     });
    
//     let commission = await prisma.commission.findFirst({
//         where : {
//             roleId : findrole.roleId,
//             isActive : true
//         }
//     });
//     let commissionAmount = commission.commissionType === "percentage" ? ((order.totalPrice * commission.value) / 100) :  commission.value;
    
//     let totalAmount = order.totalPrice + commissionAmount;

//     return {order, commission , commissionAmount, totalAmount};
// }

export const createTransaction = async (userId, orderId, paymentMethod, referenceId, screenshot) => {
    let screenshotUpload;
    try {

        let { error } = createTransactionValidation.validate({paymentMethod, referenceId});
        if(error){
            throw error;
        }

        if(screenshot === undefined){
            throw new Error("Screenshot required");
        }

        screenshotUpload = await cloudinaryFile(screenshot);
        if(screenshot){
            deleteLocalFile(screenshot);
        }

            // let {order, commission , commissionAmount, totalAmount } = await getTotalAmount(userRole,orderId);
        let order = await prisma.vendorOrder.findUnique({
            where: { vendorOrderId: orderId }
        });

        let orderType = "vendor";

        if (!order) {
            order = await prisma.userOrder.findUnique({
                where: { userOrderId: orderId }
            });
            orderType = "user";
        }

        if (!order) {
            throw new Error("Order not found");
        }

            const result = await prisma.$transaction(async (tx) => {
                let payment = await tx.transaction.create({
                    data: {
                        userId,
                        amount: order.totalPrice,
                        paymentMethod,
                        referenceId,
                        screenShot: screenshotUpload.secure_url,
                        screenshotPulicId : screenshotUpload.public_id,
                        orderId,
                        orderType
                    }
                });

            let user = await tx.user.findUnique({
                where : {userId}
            })
            return { payment , user}
        });
        paymentMail(result.user.email);
        return result.payment;
    } catch (error) {
            if(screenshot){
                deleteLocalFile(screenshot);
            }

            if(screenshotUpload?.public_id){
                await cloudinary.uploader.destroy(screenshotUpload.public_id);
            }
        throw error;
    }
};

let deleteLocalFile = (filePath) => {
    if (!filePath) return;

    fs.unlink(filePath, (err) => {
        if (err) console.log("Local file delete error:", err);
    });
}

export const bankDetails = async (accountHolder, bankName, accountNumber, ifscCode, upiId) => {
    try {
        let { error } = bankDetailsValidation.validate({accountHolder, bankName, accountNumber, ifscCode, upiId});
        if(error){
            throw error;
        }

        return await prisma.platformBankDetail.create({
            data : {
                accountHolder,
                bankName,
                accountNumber,
                ifscCode,
                upiId
            }
        });

    } catch (error) {
        throw error;
    }
}

export const updateBankDetails = async(bankId, newName, newBank, newNumber, newIfsc, newUpi) => {
    try {
        let existingData = await prisma.platformBankDetail.findUnique({
            where : {platformBankDetailId : bankId}
        });
        
        let name = newName ?? existingData.accountHolder;
        let bank = newBank ?? existingData.bankName;
        let number = newNumber ?? existingData.accountNumber; 
        let ifsc = newIfsc ?? existingData.ifscCode;
        let upi = newUpi ?? existingData.upiId;

        let { error } = bankDetailsValidation.validate({name, bank, number, ifsc, upi});
        if(error){
            throw error;
        }

        return await prisma.platformBankDetail.update({
            where : {platformBankDetailId : bankId},
            data : {
                accountHolder : name,
                bankName : bank,
                accountNumber : number,
                ifscCode : ifsc,
                upiId : upi
            }
        })

    } catch (error) {
        throw error;
    }
}

export const getBankDetail = async() => {
    try {
        return await prisma.platformBankDetail.findMany({
            where : {isActive : true}
        });

    } catch (error) {
        throw error;
    }
}

export const getTransaction = async(status) => {
    try {
        return await prisma.transaction.findMany({
            where : {
                status : status
            }
        });

    } catch (error) {
        throw error;
    }
}

export const editTransaction = async(transactionId,status) => {
    try {
        let transaction = await  prisma.transaction.findUnique({
            where : {transactionId}
        });
        if(!transaction){
            throw new Error("Transaction not found");
        }
        if (transaction.status === "success" && status === "success") {
            throw new Error("Transaction already marked as SUCCESS");
        }

        if(status === "success" && transaction.orderType === "user"){
            await authorEarning(transaction);
        }
        else if(status === "success" && transaction.orderType === "vendor"){
            await vendorEarning(transaction);
        }

        let updateStatus = await prisma.transaction.update({
            where : {transactionId},
            data : {
                status : status
            }
        });
        if(updateStatus){

            let userEmail = await prisma.user.findUnique({where : {userId : transaction.userId},select : {email : true}});
            
            await paymentStatusEmail(userEmail.email,status);
        }
        return updateStatus;

    } catch (error) {
        throw error;
    }
}

const authorEarning = async(transaction) => {
    try {
        const order = await prisma.userOrder.findUnique({
            where: { userOrderId: transaction.orderId },
            include: {
                items: {
                    include: {
                        book: true
                    }
                }
            }
        });

        if (!order) throw new Error("Order not found");

        let exists = await prisma.earning.findFirst({
            where: { transactionId: transaction.transactionId }
        });
        if (exists) return;

        let authorId = order.items[0].book.authorId;

        const user = await prisma.user.findUnique({
            where: { userId :  authorId},
            include: {
                role: {
                    include: {
                        commission: {
                            where: { isActive: true }
                        }
                    }
                }
            }
        });

        for (const item of order.items) {
            
            const amount = item.price * item.quantity;

            const FindCommission = user.role.commission?.[0];
            if(!FindCommission){
                throw new Error("Commission not set");
            }

            let commission = FindCommission.commissionType === "percentage" ? ((amount * FindCommission.value) / 100) :  FindCommission.value;

            const netAmount = amount - commission;

            await prisma.earning.create({
                data: {
                    userId: item.book.authorId,
                    bookId: item.bookId,
                    quantity : item.quantity,
                    transactionId: transaction.transactionId,
                    amount,
                    commission,
                    netAmount 
                }
            });
        }
    } catch (error) {
        throw error;
    }
};

const vendorEarning = async (transaction) => {
    try {
        const order = await prisma.vendorOrder.findUnique({
            where: { vendorOrderId: transaction.orderId },
                include: {
                    book: true
            }
        });
    
        const exists = await prisma.earning.findFirst({
            where: {
                transactionId: transaction.transactionId
            }
        });
    
        if (exists) return;

        const user = await prisma.user.findUnique({
            where: { userId : transaction.userId },
            include: {
                role: {
                    include: {
                        commission: {
                            where: { isActive: true }
                        }
                    }
                }
            }
        });
        const amount = order.totalPrice;

        const FindCommission = user.role.commission?.[0];
        if(!FindCommission){
            throw new Error("Commission not set");
        }

        let commission = FindCommission.commissionType === "percentage" ? ((amount * FindCommission.value) / 100) :  FindCommission.value;

        const netAmount = amount - commission;
        await prisma.earning.create({
            data: {
                userId: order.vendorId,
                bookId: order.bookId,
                quantity : order.quantity,
                transactionId: transaction.transactionId,
                amount,
                commission,
                netAmount
            }
        });
    } catch (error) {
        throw error;
    }
};
