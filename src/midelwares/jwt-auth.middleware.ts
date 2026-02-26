import {RequestHandler} from "express";
import {getToken, verifyToken} from "src/services/jwt.service";

export const JwtAuthMiddleware: RequestHandler = (req, res, next)=> {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "Token not found" });

    const verifiedToken = verifyToken(token);
    if (!verifiedToken || !verifiedToken.userId) return res.status(401).json({ message: "Invalid token" });

    req.user = {id: verifiedToken.userId};

    next();
}