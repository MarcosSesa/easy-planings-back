import { email, object, string } from "zod";

export const loginUserValidator = object({
  email: email().nonempty("An email is required"),
  password: string()
    .nonempty("A password is required")
    .min(8, "Password must be at least 8 characters"),
});
