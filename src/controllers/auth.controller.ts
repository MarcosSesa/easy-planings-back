import {RequestHandler} from "express";
import jwt from "jsonwebtoken";
import {registerUserValidator} from "../validators/user/register";
import {createUser, findUser} from "src/services/auth.service";
import {loginUserValidator} from "src/validators/user/login";
import {compareHash, hash} from "src/services/bcrypt.service";


export const registerUser: RequestHandler = async (req, res, next) => {
    try {
        const userData = registerUserValidator.parse(req.body);
        const passwordHash = await hash(userData.password);
        const newUser = await createUser(userData.name, userData.email, passwordHash);

        if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET is not defined");

        const token = jwt.sign({user: newUser}, process.env.TOKEN_SECRET);

        return res.status(201).json({message: "User registered successfully", token: token});

    } catch (error) {
        next(error);
    }
};

export const loginUser: RequestHandler = async (req, res, next) => {
    try {
        const loginData = loginUserValidator.parse(req.body);
        const user = await findUser(loginData.email)

        if (!user) return res.status(401).json({message: "Email o contraseña incorrectos"});

        const isValid = compareHash(loginData.password, user.passwordHash);

        if (!isValid) return res.status(401).json({message: "Email o contraseña incorrectos"});

        if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET no definido");

        const token = jwt.sign({userId: user.id, email: user.email}, process.env.TOKEN_SECRET);

        res.status(200).json({message: "Login exitoso", token,});
    } catch (error) {
        next(error);
    }
};
