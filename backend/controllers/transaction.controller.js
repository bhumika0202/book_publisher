import { createTransaction , bankDetails, updateBankDetails, getBankDetail, getTransaction, editTransaction } from "../services/transaction.service.js";

const makePayment = async(req,res, next) => {
    try {
        
        let userId = req.user.userId;
        let orderId = Number(req.params.orderId);
        const {paymentMethod, referenceId } = req.body;

        let screenshot = req.file?.path;

        if (!orderId || isNaN(orderId)) {
            return res.status(400).json({ message: "Invalid orderId" });
        }
        let result = await createTransaction(userId,orderId, paymentMethod, referenceId, screenshot);

        res.status(201).json({message : "Payment made successfully", data : result})
    } catch (error) {
        next(error);
    }
}

// const checkTotalAmount = async(req,res, next) => {
//     try {

//         let orderId = Number(req.params.orderId);        
//         let { totalAmount } = await getTotalAmount(orderId);

//         res.status(200).json({message : "total amount calculated successfully", data : totalAmount});

//     } catch (error) {
//            next(error);
//     }
// }

const addBankDetails = async(req,res, next) => {
    try {
        const { accountHolder, bankName, accountNumber, ifscCode, upiId } = req.body;

        let result = await bankDetails(accountHolder, bankName, accountNumber, ifscCode, upiId);

        res.status(201).json({message : "bank details added successfully", data : result});

    } catch (error) {
        next(error);
    }
}

const editBankDetails = async(req,res,next) => {
    try {
        let bankId = Number(req.params.id);
        let name = req.body.accountHolder;
        let bank = req.body.bankName;
        let number = req.body.accountNumber;
        let ifsc = req.body.ifscCode;
        let upi = req.body.upiId;

        let result = await updateBankDetails(bankId, name, bank, number, ifsc, upi);

        res.status(200).json({message : "bank details updated successfully", data : result});

    } catch (error) {
        next(error);    
    }
}

const getBankDetails = async(req,res, next) => {
    try {

        let result = await getBankDetail();

        res.status(200).json({message : "bank details fetched successfully", data : result});

    } catch (error) {
        next(error);
    }
}

const getAllTransaction = async(req,res, next) => {
    try {
        let status = req.query.status || undefined;
        let result = await getTransaction(status);

        res.status(200).json({message : "All transactions fetched successfully", data : result});

    } catch (error) {
        next(error);
    }
}

const editTransactionStatus = async(req,res, next) => {
    try {
        let transactionId = Number(req.params.id);
        let status = req.query.status;
        if(!status){
            throw new Error("status is required");
        }
        let result = await editTransaction(transactionId, status);

        res.status(200).json({message : "transaction status edited successfully", data : result});

    } catch (error) {
        next(error);
    }
}


export default {
    makePayment,
    // deletePayment,
    addBankDetails,
    editBankDetails,
    getBankDetails,
    getAllTransaction,
    // getTransactionRequest,
    editTransactionStatus,
    // checkTotalAmount
}