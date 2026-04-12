import {coerce, object, optional, string, uuid} from "zod";

export const upsertActivityParamsValidator = object({
    tripId: uuid().nonempty('Parameter tripId cannot be empty'),
    dayId: uuid().nonempty('Parameter dayId cannot be empty')
})

export const upsertActivityBodyValidator = object({
    activityId: optional(uuid()),
    title: string().nonempty('Parameter title cannot be empty'),
    description: string(),
    location: string().nonempty('Parameter location cannot be empty'),
    startTime: coerce.date(),
    endTime: coerce.date(),
});
