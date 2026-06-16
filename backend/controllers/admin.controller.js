import { createCommission, activeCommission , getCommission, getEarning, 
    userWiseEarning, createRole, updateRole, allRole, userList, deleteUser, 
    userStatus, editUser, viewWithdrawalRequest ,acceptWithrawal, 
    rejectWithdrawal, } from "../services/admin.service.js";

let addRole = async(req, res, next ) => {
    try {
        let { roleName } = req.body;
        let result = await createRole(roleName);

        res.status(201).json({message : "new role added successfully", data : result})
    } catch (error) {
        next(error);
    }
}

let editRole = async(req, res , next) => {
    try {
        let roleId = Number(req.params.roleId);
        let { roleName } = req.body;

        let result = await updateRole(roleId,roleName);

        res.status(200).json({message : "role updated successfully", data : result})
    } catch (error) {
        next(error);
    }
}

let getRole = async(req, res, next ) => {
    try {
        let result = await allRole();

        res.status(200).json({message : "All roles fetched successfully", data : result})
    } catch (error) {
        next(error);
    }
}

let setCommission = async(req, res, next) => {
    try {
        let { roleId, commissionType, value } = req.body;

        let result = await createCommission(roleId,commissionType,value);

        res.status(201).json({message : "commission added successfully", data : result});
    } catch (error) {
        next(error);
    }
}

let changeCommissionStatus = async(req, res, next) => {
    try {
        let commissionId = Number(req.params.id);

        let result = await activeCommission(commissionId);

        res.status(200).json({message : "commission updated successfully", data : result});

    } catch (error) {
        next(error);
    }
}

let getAllCommission = async(req, res, next) => {
    try {
        let result = await getCommission();

        res.status(200).json({message : "commission fetched successfully", data : result});

    } catch (error) {
        next(error);
    }
}

let viewEarning = async(req, res, next) => {
    try {
        let role = req.query.role;        
        // let {totalAmountGross, TotalAmountPayable, totalAmountPayed, remainingAmountPayable, platformEarning} = await getEarning(role);
        let result = await getEarning(role);
        res.status(200).json({message : "earning fetched successfully", data : result});

        // res.status(200).json({message : "earning fetched successfully", data : {totalAmountGross, TotalAmountPayable, totalAmountPayed, remainingAmountPayable, platformEarning}});
    } catch (error) {
        next(error);
    }
}

let viewUserEarning = async(req, res, next) => {
    try {
        let role = req.query.role;        
        let result = await userWiseEarning( role);
        
        res.status(200).json({message : "users earning fetched successfully", data : result});
    } catch (error) {
        next(error);
    }
}

let getAllUserList = async(req,res, next) => {
    try {
        let role = req.query.role;

        let page = Number(req.query.pageNo) || 1;
        let limit = Number(req.query.pageLimit) || 10;

        let result = await userList(role, page, limit);

        res.status(200).json({message : "all user list get successfully", data : result});

    } catch (error) {
        next(error);    
    }
}

let editUserInfo = async(req,res, next) => {
    try {
        let userId = Number(req.params.id);
        if (isNaN(userId)) {
            throw new Error("Invalid user id");
        }
        const { name, email, password } = req.body;

        let result = await editUser(userId, name, email, password);

        res.status(200).json({message : "user info updated successfully", data : result});

    } catch (error) {
        next(error);
    }
}

let deleteUserAccount = async(req, res , next) => {
    try {
        let userId = Number(req.params.id);
        if (isNaN(userId)) {
            throw new Error("Invalid user id");
        }
        let user = await deleteUser(userId);
        res.status(200).json( { message : "user account deleted successfully", data : user});
    } catch (error) {
        next(error);
    }
}

let editUserStatus = async(req, res , next) => {
    try {
        let userId = Number(req.params.id);
        if (isNaN(userId)) {
            throw new Error("Invalid user id");
        }
        await userStatus(userId);

        res.status(200).json( { message : "user account status changed successfully"});
    } catch (error) {
        next(error);
    }
}

let getwithdrawalRequest = async(req, res, next) => {
    try {
        let result = await viewWithdrawalRequest();
        
        res.status(200).json({message : "Withdrawal request fetched successfully", data : result});
    } catch (error) {
        next(error);
    }
}

let acceptWithrawalReq = async(req, res, next) => {
    try {
        let requestId = Number(req.params.id);
        if (isNaN(requestId)) {
            throw new Error("Invalid request id");
        }
        let result = await acceptWithrawal(requestId);
        
        res.status(200).json({message : "Withdrawal request accepted successfully", data : result});
    } catch (error) {
        next(error);
    }
}

let rejectWithdrawalReq = async(req,res, next) => {
    try {
        let requestId = Number(req.params.id);
        if (isNaN(requestId)) {
            throw new Error("Invalid request id");
        }
        let result = await rejectWithdrawal(requestId);
        
        res.status(200).json({message : "Withdrawal request rejected successfully", data : result});
    } catch (error) {
        next(error);
    }
}

export default {
    addRole,
    editRole,
    getRole,
    setCommission,
    changeCommissionStatus,
    getAllCommission,
    viewEarning,
    viewUserEarning,
    deleteUserAccount,
    getAllUserList,
    editUserStatus,
    editUserInfo,
    getwithdrawalRequest,
    acceptWithrawalReq,
    rejectWithdrawalReq
}