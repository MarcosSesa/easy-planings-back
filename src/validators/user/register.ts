import { object, string, email } from "zod";

export const registerUserValidator = object({
  name: string().nonempty("A name is required"),
  email: email().nonempty("An email is required"),
  password: string()
    .nonempty("A password is required")
    .min(8, "Password must be at least 8 characters"),
});
