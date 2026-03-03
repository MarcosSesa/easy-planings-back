import {object, uuid} from "zod";

export const getTripDaysByIdParamValidator = object({
    tripId: uuid().nonempty('Parameter Id is not present or is not a valid UUID')
})