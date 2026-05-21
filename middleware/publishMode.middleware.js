export const checkPublishMode = (req, res, next) => {

    const { publishMode } = req.body;

    if (publishMode === 1 || publishMode === "online") {
        req.publishType = "online";
    }
    else if (publishMode === 2 || publishMode === "offline") {
        req.publishType = "offline";
    }
    else {
        return res.status(400).json({
            message: "Invalid publish mode"
        });
    }

    next(); 
}