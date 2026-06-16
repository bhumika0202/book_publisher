import { getvendorOrder, acceptOrder, rejectOrder, updateStatus} from "../services/vendorOrder.service.js";

let orderRequestList = async(req, res, next ) => {
    try {
        
        let status = req.query.status || undefined;
        let userId = req.user.userId;
        let page = Number(req.query.page) || 1 ;
        let limit = Number(req.query.limit) || 10 ;

        let orders = await getvendorOrder(userId, status, page, limit);
        res.status(200).json({message : "order fetched successfully", data : orders});

    } catch (error) {
        next(error);
    }
}
/*
let completedOrders = async(req,res , next) => {
    try {
        let userId = req.user.userId;
        
        let orders = await getcompletedOrder(userId);

        res.status(200).json({message : "order fatched successfully", data : orders});

    } catch (error) {
     next(error);
    }
}

let pendingOrder = async(req,res , next) => {
    try {
        let userId = req.user.userId;
        let orders = await getPendingOrder(userId);

        res.status(200).json({message : "order fatched successfully", data : orders});

    } catch (error) {
     next(error);
    }
}

let ongoingOrder = async(req,res, next ) => {
    try {
        let userId = req.user.userId;        
        let orders = await getOngoingOrder(userId);

        res.status(200).json({message : "ongoing order fatched successfully", data : orders});

    } catch (error) {
     next(error);
    }
}
*/

let acceptPendingOrder = async(req,res, next) => {
    try {
        let orderId = Number(req.params.vendorOrderId);
        let userId = req.user.userId
        
        let orders = await acceptOrder(orderId,userId);

        res.status(200).json({message : "order request accepted successfully", data : orders});
    } catch (error) {
        next(error);
    }
}

let rejectPendingOrder = async(req,res, next) => {
    try {
        let orderId = Number(req.params.vendorOrderId);
        let userId = req.user.userId;
        
        let orders = await rejectOrder(orderId,userId);

        res.status(200).json({message : "order request rejected successfully", data : orders});
    } catch (error) {
        next(error);
    }
}

let updateOrderstatus = async(req,res, next) => {
    try {
        let status = req.query.status;
        if(!status){
            throw new Error("status is required");
        }
        let orderId = Number(req.params.vendorOrderId);
        let userId = req.user.userId;
        
        let orders = await updateStatus(orderId, userId, status);

        res.status(200).json({message : "order status updated successfully", data : orders});
    } catch (error) {
        next(error);
    }
}

export default {
    orderRequestList,
    // completedOrders,
    // pendingOrder,
    // ongoingOrder,
    acceptPendingOrder,
    rejectPendingOrder,
    updateOrderstatus
}