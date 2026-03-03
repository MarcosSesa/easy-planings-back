import {object, uuid, z} from "zod";

export const acceptMemberValidator = object({
    memberId: uuid(),
    status: z.enum(["ACCEPTED", "REJECTED"]),
})