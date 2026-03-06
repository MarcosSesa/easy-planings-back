import {object, uuid} from "zod";

export const deleteActivityParamsValidator = object({
    tripId: uuid().nonempty('Parameter tripId cannot be empty'),
    dayId: uuid().nonempty('Parameter dayId cannot be empty'),
    activityId: uuid().nonempty('Parameter activity id cannot be empty'),
})