import {RequestHandler} from "express";
import {getToken, verifyToken} from "src/services/jwt.service";

export const JwtAuthMidelware: RequestHandler = (req, res, next)=> {
    const token = getToken(req);
    if (!token) return res.status(401).json({message: "Token not found"});
    const verifiedToken = verifyToken(token)
    if (!verifiedToken) return res.status(401).json({message: "Token is incorrect"});
    const userId = verifiedToken.userId;
    req.params = {...req.params, userId: userId};
    next();
}