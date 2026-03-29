import {object, z} from "zod";

export const getTripsQueryValidator = object({
    filter: z.enum(["past", "current", "future"]).optional(),
})

