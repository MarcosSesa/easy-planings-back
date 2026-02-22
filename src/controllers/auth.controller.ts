import { RequestHandler } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerUserValidator } from "../validators/user/register";
import { prisma } from "../services/prisma";

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const userData = registerUserValidator.parse(req.body);
    const passwordHash = await bcrypt.hash(userData.password, 6);
    const newUser = await prisma.user.create({
      data: { name: userData.name, email: userData.email, passwordHash },
    });
    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is not defined");
    }
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET);

    res
      .status(201)
      .json({ message: "User registered successfully", token: token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed at register new user",
        errors: error.issues.map((issue) => issue.message),
      });
    }
  }
};

export const loginUser: RequestHandler = async (req, res) => {};
