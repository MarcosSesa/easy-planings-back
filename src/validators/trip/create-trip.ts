import {object, string, z} from "zod";

export const crateTripValidator = object({
    title: string("Title is required").nonempty("Title cannot be empty"),
    description: string().max(250, 'Description should be less than 250 characters long'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
})