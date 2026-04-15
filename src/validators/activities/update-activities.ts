import {array, coerce, object, optional, string, uuid} from "zod";

export const updateActivitiesParamsValidator = object({
    tripId: uuid().nonempty('Parameter tripId cannot be empty'),
    dayId: uuid().nonempty('Parameter dayId cannot be empty')
})

const activitySchema = object({
    activityId: optional(uuid()),
    title: string().nonempty('Parameter title cannot be empty'),
    description: string(),
    location: string().nonempty('Parameter location cannot be empty'),
    startTime: coerce.date(),
    endTime: coerce.date(),
});

export const updateActivitiesBodyValidator = object(
    {
        activities: array(activitySchema)
    },
    {error: "Request body is required"});

export type ActivityInterface = {
    activityId?: string;
    title: string;
    description: string;
    location: string | null;
    startTime: Date;
    endTime: Date;
};
