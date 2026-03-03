import {object, string, uuid, z} from "zod";

export const updateTripBodyValidator = object({
    title: string().nonempty("Title is required"),
    description: string().max(250, 'Description should be less than 250 characters long'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
})

export const updateTripParamValidator = object({
    id: uuid().nonempty('Parameter Id is not present or is not a valid UUID')
})