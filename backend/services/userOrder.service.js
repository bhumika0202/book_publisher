import prisma from "../config/db.config.js";
import {getCartItems} from "../services/cart.service.js";
import { orderplaced } from "./email.service.js";

export const userOrder = async (userId) => {
    try {
        let { cartItems, totalPrice } = await getCartItems(userId);
        const result = await prisma.$transaction(async (tx) => {
            // userRole = "User";

            // let findrole = await tx.role.findFirst({
            //     where : {roleName : userRole}
            // });
            
            // let commission = await tx.commission.findFirst({
            //     where : {
            //         roleId : findrole.roleId,
            //         isActive : true
            //     }
            // });
            // let commissionAmount = commission.commissionType === "percentage" ? ((totalPrice * commission.value) / 100) :  commission.value;
            
            // let totalAmount = totalPrice + commissionAmount;

            let order = await tx.userOrder.create({
                data: {
                    userId: userId,
                    totalPrice: totalPrice
                }
            });
    
            for (let item of cartItems) {
                await tx.userOrderItem.create({
                    data: {
                        userOrderId: order.userOrderId,
                        bookId: item.bookId,
                        quantity: item.quantity,
                        price: item.books.price
                    }
                });
            }
            await tx.cart.deleteMany({
                where: { userId }
            });
            let userEmail = await tx.user.findUnique({where : {userId}});
            
            return {order, email : userEmail.email};
        });
        await orderplaced(result.email);
        return result.order;
    } catch (error) {
        throw error;
    }
};

export const purchasedBook = async(userId) => {
    try {
        const result = await prisma.$transaction(async (tx) => {

            let orderedBooks = await tx.userOrder.findMany({
                where : { userId },
                include : {
                    items : true
                }
            });
            if(orderedBooks.length === 0){
                throw new Error("No orders found");
            }
            let orderIds = orderedBooks.map(order => order.userOrderId);

            let checkPayment = await tx.transaction.findMany({
                where : {
                    userId,
                    orderId : {
                        in : orderIds
                    }
                }
            });

            if(checkPayment.length === 0){
                throw new Error("first make payment to view books");
            }            

            let bookIds = [];

            for (let order of orderedBooks) {
                for (let item of order.items) {
                    bookIds.push(item.bookId);
                }
            }
            
            let books = await tx.book.findMany({
                where : {
                    bookId : {
                        in : bookIds
                    }
                },
                select : {
                    bookId: true,
                    title : true,
                    description : true,
                    contentUrl : true
                }
            });
        return books;
    });
    return result;

    } catch (error) {
        throw error;
    }
}

export const purchaseHistory = async(userId) => {
    try {
        let orderedBooks = await prisma.userOrder.findMany({
            where : { userId },
            include : {
                items : true
            }
        });
        return orderedBooks;
    } catch (error) {
        throw error;
    }
}