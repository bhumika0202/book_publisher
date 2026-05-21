import prisma from "../config/db.config.js";
import { createCommissionValidation, userRoleValidation , editUserValidation, editUserPwdValidation , bankDetailsValidation } from "../validations/admin.validation.js";
import { statusChangeEmail } from "./email.service.js";

export const createRole = async(roleName) => {
    try {
        let { error } = userRoleValidation.validate({roleName});
        if(error) {
            throw error;
        }
        let existing = await prisma.role.findUnique({ 
            where: { roleName } 
        });
        if (existing) {
            throw new Error("Role already exists");
        }
        return await prisma.role.create({
            data : { roleName : roleName.trim()}
        });

    } catch (error) {
        throw error;
    }
}

export const updateRole = async(roleId,roleName) => {
    try {
        let { error } = userRoleValidation.validate({roleName});
        if(error) {
            throw error;
        }
        let role = await prisma.role.findUnique({ where: { roleId } });
        if (!role) {
            throw new Error("Role not found");
        }
        return await prisma.role.update({
            where : {roleId},
            data : { roleName : roleName.trim() },
        });
    } catch (error) {
        throw error;
    }
}

export const allRole = async() => {
    try {
        return await prisma.role.findMany();
    } catch (error) {
        throw error;
    }
}

export const createCommission = async (roleId,commissionType,value) => {
    try {
        
        let { error } = createCommissionValidation.validate({commissionType, value});
        if(error) {
            throw error;
        }
        return await prisma.commission.create({
            data : {
                roleId,
                commissionType,
                value
            }
        });
    } catch (error) {
        throw error;
    }
}

export const activeCommission = async(commissionId) => {
    try {
        let commission = await prisma.commission.findUnique({
            where : {commissionId},
            select : {
                isActive : true
            }
        });
        if (!commission) throw new Error("Commission not found");
        
        const newStatus = !commission.isActive;

        return await prisma.commission.update({
            where : {commissionId},
            data : {
                isActive : newStatus
            }
        }) 
    } catch (error) {
        throw error;
    }
}

export const getCommission = async () => {
    try {
        return await prisma.commission.findMany();
        
    } catch (error) {
        throw error;
    }
}

export const getEarning = async( role) => {
    try {
        let totalAmount = await prisma.earning.aggregate({
            _sum : {
                amount : true,
                netAmount : true
            },
            where : {
                user : {
                    role : {
                        roleName : role     
                    }
                }
            }
        });

        let totalAmountPayedResult = await prisma.withdrawal.aggregate({
            _sum : {
                amountRequested : true
            },
            where : {
                users : {
                    role : {
                        roleName : role     
                    }
                },
                status : {
                    not : "success"
                }
            }
        });

        let totalAmountGross = totalAmount._sum.amount ?? 0 ;
        let TotalAmountPayable = totalAmount._sum.netAmount ?? 0;

        let totalAmountPayed = totalAmountPayedResult._sum.amountRequested ?? 0; 

        let remainingAmountPayable = TotalAmountPayable - totalAmountPayed;
         
        let platformEarning = totalAmountGross - TotalAmountPayable;

        return {totalAmountGross, TotalAmountPayable, totalAmountPayed, remainingAmountPayable, platformEarning};
        
    } catch (error) {
        throw error;
    }
}

export const userWiseEarning = async(role) => {
    try {
        
        let earningData = await prisma.earning.groupBy({
            by : ["userId"],
            where : {
                user : {
                    role : {
                        roleName : role     
                    }
                }
            },
            _sum : {
                netAmount : true
            }
        });
        // console.log("earning : ",earningData);
        
        let withdrawalData = await prisma.withdrawal.groupBy({
            by : ["userId"],
            where : {
                status : "success"
            },
            _sum : {
                amountRequested : true
            }
        })        
        // console.log("withdrawal : ",withdrawalData);

        const earningObj = {};
        earningData.forEach(e => {
            earningObj[e.userId] = e._sum.netAmount ?? 0            
        });

        const withdrawalObj = {};
        withdrawalData.forEach(w => {
            withdrawalObj[w.userId] = w._sum.amountRequested ?? 0;            
        });
        
        const users = await prisma.user.findMany({
            where: {
                role: {
                    roleName: role
                }
            },
            select: {
                userId: true,
                name: true,
                email: true
            }
        });
        // console.log(users);
        
        const finalResult = users.map(user => {
            const totalEarning = earningObj[user.userId] ?? 0;
            const totalWithdrawal = withdrawalObj[user.userId] ?? 0;

            return {
                ...user,
                totalEarning,
                totalWithdrawal,
                remainingAmount: totalEarning - totalWithdrawal
            };
        });
        return finalResult;
    } catch (error) {
        throw error;
    }
}

export const userList = async(role, page, limit) => {
    try {
        let skip = ((page - 1) * limit);
        return await prisma.user.findMany({
            where : {
                role : {
                    roleName : role
                }
            },
            select : {
                userId : true,
                name : true,
                email : true,
                isActive : true,
                role : {
                    select : {
                        roleName : true
                    }
                }
            },
            skip : skip,
            take : limit
        });
        
    } catch (error) {
        throw error;
    }
}

export const editUser = async(userId, newName, newEmail, password) => {
    try {
        if(password){
            let { error } = editUserPwdValidation.validate({password});
            if(error) {  throw error }
        }
        let existingData = await prisma.user.findUnique({
            where : {userId}
        });
        if (!existingData) {
            throw new Error("User not found");
        }
        let name = newName ?? existingData.name;
        let email = newEmail ?? existingData.email;
        let newPwd = password  !== undefined ? await bcrypt.hash(password,10) : existingData.password;  

        let { error } = editUserValidation.validate({name, email})
        if(error){
            throw error;
        }

        return await prisma.user.update({
            where : {userId : user_Id},
            data : {
                name : name,
                email : email,
                password : newPwd
            }
        });
        
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async(userId) => {
    try {
        let existingData = await prisma.user.findUnique({
            where : {userId}
        });
        if (!existingData) {
            throw new Error("User not found");
        }
        return await prisma.user.delete({
            where : {userId}
        });
        
    } catch (error) {
        throw error;
    }
}

export const userStatus = async(userId) => {
    try {

        let user = await prisma.user.findUnique({
            where : {userId}
        });
        if (!user) {
            throw new Error("User not found");
        }
        const newStatus = !user.isActive;

        await prisma.user.update({
            where: { userId },
            data: { isActive: newStatus }
        });
        await statusChangeEmail(user.email);
    } catch (error) {
        throw error;
    }
}

export const viewWithdrawalRequest = async() => {
    try {
        return await prisma.withdrawal.findMany();

    } catch (error) {
        throw error;
    }
}

export const acceptWithrawal = async(requestId) => {
    try {
        let req = await prisma.withdrawal.findUnique({
            where : {requestId}
        });
        if (!req) {
            throw new Error("Request not found");
        }
        return await prisma.withdrawal.update({
            where : {withdrawalId : requestId},
            data : {
                status : "success"
            }
        });
        
    } catch (error) {
        throw error;
    }
}

export const rejectWithdrawal = async(requestId) => {
    try {
        let req = await prisma.withdrawal.findUnique({
            where : {requestId}
        })
        if (!req) {
            throw new Error("Request not found");
        }

        return await prisma.withdrawal.update({
            where : {withdrawalId : requestId},
            data : {
                status : "failed"
            }
        })
    } catch (error) {
        throw error;
    }
}

