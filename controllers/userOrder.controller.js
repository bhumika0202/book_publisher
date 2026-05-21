import { userOrder , purchasedBook , purchaseHistory} from "../services/userOrder.service.js"

let placeUserOrder = async(req,res, next) => {
    try {
        let userId = req.user.userId;
        let order = await userOrder(userId);
        
        res.status(201).json({ message : "order placed successfully", data : order})
    } catch (error) {
        next(error);
    }
}

let viewPurchasedBook = async(req,res, next) => {
    try {
        let userId = req.user.userId;
        let books = await purchasedBook(userId);
        
        res.status(200).json({ message : "purchased book found successfully", data : books});
    } catch (error) {
        next(error);
    }
}

let viewOrderHistory = async(req,res, next) => {
    try {
        let userId = req.user.userId;
        let orders = await purchaseHistory(userId);

        res.status(200).json({ message : "purchase history found successfully", data : orders})
    } catch (error) {
        next(error);
    }
}
export default {
    placeUserOrder,
    viewPurchasedBook,
    viewOrderHistory
}