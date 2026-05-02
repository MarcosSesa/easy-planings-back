import {RequestHandler} from "express";
import {getToken, verifyToken} from "src/services/jwt.service";

/**
 * JWT Authentication Middleware
 * Validates JWT token from the request and extracts userId to attach to req.user.
 * Returns 401 if token is missing or invalid.
 */
export const JwtAuthMiddleware: RequestHandler = (req, res, next)=> {
    // Extract token from request headers
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "Token not found" });

    // Verify token signature and expiration
    const verifiedToken = verifyToken(token);
    if (!verifiedToken || !verifiedToken.userId) return res.status(401).json({ message: "Invalid token" });

    // Attach user information to request object
    req.user = {id: verifiedToken.userId};

    // Pass control to the next middleware/route handler
    next();
}