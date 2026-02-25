import jwt, {JwtPayload, SignOptions, VerifyOptions} from "jsonwebtoken";

type jwtPayload = string | Buffer | object;

export const sign = (payload: jwtPayload, options?: SignOptions,) => {
    if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET is not defined");
    return jwt.sign(payload, process.env.TOKEN_SECRET, options);
}

export const verifyToken = (token: string, options?: VerifyOptions & {complete: true}) => {
    if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET is not defined");
    return jwt.verify(token, process.env.TOKEN_SECRET, options ) as JwtPayload;

}

// @ts-ignore
export const getToken = ( req: Request<Record<string, any>>): string | undefined => req.headers.authorization?.replace("Bearer ", "");