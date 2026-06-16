import { addCart, updateqty, getCartItems, deleteItem, deleteAllItem } from "../services/cart.service.js"

let addToCart = async(req, res, next ) => {
    try {
        let userId = req.user.userId;        
        let bookId = Number(req.params.bookId);

        let result = await addCart(userId,bookId);
        res.status(20).json({ message : "book added in cart successfully", data : result})
    } catch (error) {
        next(error);
    }
}

let editQuantity = async(req, res , next) => {
    try {
        let cartId = Number(req.params.cartId);
        let { quantity } = req.body;

        let result = await updateqty(cartId,quantity);
        
        res.status(200).json({ message : "book quantity updated in cart successfully", data : result})
    } catch (error) {
        next(error);
    }
}

let viewCart = async(req,res, next) => {
    try {
        let userId = req.user.userId;
        let {cartItems, totalPrice} = await getCartItems(userId);
        
        res.status(200).json({ message : "cart items fetched successfully", data : cartItems, totalPrice})
    } catch (error) {
        next(error);
    }
}

let deleteCartItem = async(req,res, next) => {
    try {
        let cartId = Number(req.params.id);
        let result = await deleteItem(cartId);

        res.status(200).json({message : "cart item deleted successfully", data : result})
    } catch (error) {
        next(error);
    }
}

let deleteAllCartItems = async(req,res, next) => {
    try {
        let userId = req.user.userId;
        let result = await deleteAllItem(userId);

        res.status(200).json({message : "All cart item deleted successfully", data : result})
    } catch (error) {
        next(error);
    }
}


export default {
    addToCart,
    editQuantity,
    viewCart,
    deleteCartItem,
    deleteAllCartItems
}