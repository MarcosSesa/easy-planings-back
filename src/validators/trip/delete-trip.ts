import {object, uuid} from "zod";

export const deleteTripValidator = object({
    id: uuid().nonempty('Parameter Id is not present or is not a valid UUID')
})