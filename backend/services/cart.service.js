import prisma from "../config/db.config.js";
import { editQuantityValidation } from "../helper/validation.js";

export const addCart = async(userId,bookId) => {
    try {

        let checkCart = await prisma.cart.findFirst({
            where : {
                userId,
                bookId
            }
        });
        if(!checkCart){
            return await prisma.cart.create({
                data : {
                    userId,
                    bookId
                }
            });
        }
        return await prisma.cart.update({
            where : { cartId : checkCart.cartId },
            data : { quantity : checkCart.quantity + 1 }
        });
    } catch (error) {
        throw error;
    }
}

export const updateqty = async(cartId,quantity) => {
    try {

        let { error } = editQuantityValidation.validate({quantity});
        if(error){
            throw error;
        }

        let cart = await prisma.cart.findUnique({ where: { cartId } });
        if (!cart) {
            throw new Error("Cart item not found");
        }
        return await prisma.cart.update({
            where : { cartId },
            data : {quantity}
        });

    } catch (error) {
        throw error;
    }
}

export const getCartItems = async(userId) => {
    try {
        let cartItems = await prisma.cart.findMany({
            where : {userId},
            include : {
                books : true
            }
        });
        if(cartItems.length === 0){
            throw new Error("Your cart is empty");
        }

        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.books.price * item.quantity;
        });

        return {cartItems, totalPrice};

    } catch (error) {
        throw error;
    }
}

export const deleteItem = async (cartId) => {
    try {
        return await prisma.cart.delete({
            where : {cartId}
        });

    } catch (error) {
        throw error;
    }
}

export const deleteAllItem = async (userId) => {
    try {
        return await prisma.cart.deleteMany({
            where : {
                userId
            }
        });

    } catch (error) {
        throw error;
    }
}