import {RequestHandler} from "express";
import {registerUserValidator} from "../validators/user/register";
import {createUser, findUser} from "src/services/domain/auth.service";
import {loginUserValidator} from "src/validators/user/login";
import {compareHash, hash} from "src/services/bcrypt.service";
import {sign} from "src/services/jwt.service";


export const registerUser: RequestHandler = async (req, res, next) => {
    const userData = registerUserValidator.parse(req.body);
    const passwordHash = await hash(userData.password);
    const newUser = await createUser(userData.name, userData.email, passwordHash);

    const token = sign({username: newUser.name,userId: newUser.id, email: newUser.email});

    return res.status(201).json({message: "User registered successfully", data: token});
};

export const loginUser: RequestHandler = async (req, res, next) => {
    const loginData = loginUserValidator.parse(req.body);
    const user = await findUser(loginData.email)

    if (!user) return res.status(401).json({message: "Email or password are incorrect, please try again"});

    const isValid = await compareHash(loginData.password, user.passwordHash);

    if (!isValid) return res.status(401).json({message: "Passwords do not match, please try again"});
    
    const token = sign({username: user.name,userId: user.id, email: user.email});

    return res.status(200).json({message: "Login successful", data:token});
};
