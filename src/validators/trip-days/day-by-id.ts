import {object, uuid} from "zod";

export const getTripDayByIdParamValidator = object({
    tripId: uuid().nonempty('Parameter tripId is not present or is not a valid UUID'),
    id: uuid().nonempty('Parameter Id is not present or is not a valid UUID')

})