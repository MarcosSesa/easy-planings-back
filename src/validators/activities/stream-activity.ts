import {object, uuid} from "zod";

export const streamActivitiesParamsValidator = object({
    activityId: uuid().nonempty('Parameter tripId cannot be empty'),
})