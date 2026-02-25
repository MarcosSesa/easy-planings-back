import {ErrorRequestHandler} from "express";
import {CustomError} from "src/util/custom-error.util";

export const globalErrorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    next
) => {
    if(error instanceof  CustomError) {
        return res.status(error.statusCode).json({
            message: error.message,
            error: error,
        });
    }

    res.status(500).json({
        message: "Internal server error",
        error: error,
    });
};