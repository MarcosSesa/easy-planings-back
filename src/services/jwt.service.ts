import jwt, {JwtPayload, SignOptions, VerifyOptions} from "jsonwebtoken";
import {CustomError} from "src/util/custom-error.util";

type jwtPayload = string | Buffer | object;

export const sign = (payload: jwtPayload, options?: SignOptions,) => {
    if (!process.env.TOKEN_SECRET) throw new CustomError("TOKEN_SECRET is not defined", 500);
    return jwt.sign(payload, process.env.TOKEN_SECRET, options);
}

export const verifyToken = (token: string, options?: VerifyOptions & {complete: true}) => {
    if (!process.env.TOKEN_SECRET) throw new CustomError("TOKEN_SECRET is not defined", 500);
    return jwt.verify(token, process.env.TOKEN_SECRET, options ) as JwtPayload;

}

// @ts-ignore
export const getToken = ( req: Request<Record<string, any>>): string | undefined => req.headers.authorization?.replace("Bearer ", "");