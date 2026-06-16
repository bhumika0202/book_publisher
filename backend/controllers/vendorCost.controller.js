import {vendorCost, getVendorCost, updateCost} from "../services/vendorCost.service.js"

let addCost = async(req,res, next) => {
    try {
        let userId = req.user.userId;
        let costPerPage = req.body.costPerPage;
        let result = await vendorCost(userId, costPerPage);
        res.status(201).json({message : "vendor cost added successfully", data : result});
    } catch (error) {
        next(error);
    }
}

let updateVendorCost = async(req, res, next) => {
    try {
        let userId = req.user.userId;
        let vendorCostId = Number(req.params.id);
        let costPerPage = req.body.costPerPage;
        let result = await updateCost(userId,vendorCostId, costPerPage);

        res.status(200).json({ message: "cost updated successfully", data: result });
    } catch (error) {
        next(error);
    }
};

let getCost = async(req, res, next) => {
    try {
        let userId = req.user.userId;
        let userRole = req.user.role;
        let result = await getVendorCost(userId, userRole);

        res.status(200).json({ message: "cost fetched successfully", data: result });
    } catch (error) {
        next(error);
    }
};

export default {
    addCost,
    updateVendorCost,
    getCost
}