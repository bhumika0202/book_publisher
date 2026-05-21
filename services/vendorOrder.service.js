import prisma from "../config/db.config.js";
import { orderUpdateEmail } from "./email.service.js";


export const getvendorOrder = async(userId, status, page, limit) => {
    try {
        let skip = ((page - 1) * limit);

        const orders = await prisma.vendorOrder.findMany({
            where : 
            {   AND : [
                    {vendorId : userId},
                    {status : status}
                ]
            },
            skip : skip,
            take : limit
        });
        return orders

    } catch (error) {
        throw error;
    }
}
/*
export const getcompletedOrder= async(userId) => {
    try {
        const orders = await prisma.vendorOrder.findMany({
            where : {
                AND : [
                    {vendorId : userId},
                    { status : "completed" }
                ]
            }
        });
        return orders

    } catch (error) {
        throw error;
    }
}

export const getPendingOrder= async(userId) => {
    try {
        const orders = await prisma.vendorOrder.findMany({
            where : {
                AND : [
                    {vendorId : userId},
                    { status : "pending" }
                ]
            }
        });
        return orders

    } catch (error) {
        throw error;
    }
}

export const getOngoingOrder= async(userId) => {
    try {
        const orders = await prisma.vendorOrder.findMany({
            where : {
                AND : [
                    {vendorId : userId},
                    { status : "ongoing" }
                ]
            }
        });
        return orders

    } catch (error) {
        throw error;
    }
}
*/

export const acceptOrder= async(orderId,userId) => {
    try {
        const orders = await prisma.vendorOrder.update({
            where : {
                vendorOrderId :orderId,
                vendorId : userId
            },
            data : {
                status : "approved"
            }
        });
        return orders

    } catch (error) {
        throw error;
    }
}

export const rejectOrder= async(orderId,userId) => {
    try {
        const orders = await prisma.vendorOrder.update({
            where : {
                vendorOrderId :orderId,
                vendorId : userId
            },
            data : {
                status : "rejected"
            }
        });
        return orders

    } catch (error) {
        throw error;
    }
}

export const updateStatus= async(orderId,userId, status) => {
    try {
        if(status === "approved" || status === "ongoing" || status === "completed"){

             let findOrder = await prisma.vendorOrder.findFirst({
                where : { 
                    vendorOrderId : orderId,
                    vendorId : userId
                 }
            });

            if(!findOrder){
                throw new Error("order not found for this user");
            }

            let checkPayment = await prisma.transaction.findMany({
                where : {
                    userId: findOrder.authorId,
                    orderId: orderId,
                    orderType: "vendor",
                }
            });

            if(checkPayment.length === 0){
                throw new Error("payment is not done for this order");
            }
        }

        const orders = await prisma.vendorOrder.update({
            where : {
                vendorOrderId :orderId,
                vendorId : userId
            },
            data : {
                status : status
            }
        });
        let userEmail = await prisma.user.findUnique({where : {userId : orders.authorId}});
        orderUpdateEmail(userEmail.email, status);
        return orders;

    } catch (error) {
        throw error;
    }
}
