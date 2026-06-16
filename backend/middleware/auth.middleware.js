import jwt from "jsonwebtoken";

// check the token is valid or expired
let auth = async(req,res,next) => {
    try {
        let header = req.headers.authorization

        if(!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message : "unauthorized token"})
        }

        let token = header.split(" ")[1];
        let decode = jwt.verify(token,process.env.JWT_SECRET_KEY);

        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({ message : "unauthorized token",error});
    }
}

export default auth