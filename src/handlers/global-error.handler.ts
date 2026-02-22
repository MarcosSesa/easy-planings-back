import {ErrorRequestHandler} from "express";

export const globalErrorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    next
) => {
    res.status(500).json({
        message: "Internal server error",
    });
};