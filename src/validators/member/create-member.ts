import {email, object, uuid} from "zod";

export const crateMemberValidator = object({
    email: email().nonempty("Email is required"),
    tripId: uuid()
})