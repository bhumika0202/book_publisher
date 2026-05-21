import prisma from "../config/db.config.js";

export const checkUserRole = (roles) => {
    return async (req, res, next) => {
        
        const userId = req.user.userId;

        const findUser = await prisma.user.findUnique({
            where: { userId }
        });

        if (!findUser) {
            throw new Error("user not found");
        }
        
        if (!roles.includes(findUser.roleId)) {
            return res.status(400).json({ message: "Access denied" });
        }
        next();
    }
}