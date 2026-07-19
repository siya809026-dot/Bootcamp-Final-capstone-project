import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {

    try {

        let token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Not Found"
            });
        }

        let decode = jwt.verify(token, process.env.JWT_SECRET);

        req.userid = decode.userId;
        req.role = decode.role;

        next();

    } catch (error) {

        res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

}

export default auth;