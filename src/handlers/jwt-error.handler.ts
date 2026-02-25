import {ErrorRequestHandler} from "express";
import jwt from "jsonwebtoken";

export const jwtErrorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    next
) => {
    if (error instanceof jwt.TokenExpiredError) {
        return  res.status(401).json({message: "TOKEN is expired"});
    }
    if (error instanceof jwt.JsonWebTokenError) {
        return  res.status(401).json({message: error.message});
    }
    next(error);

};