import {RequestHandler} from "express";
import {
    updateActivitiesBodyValidator,
    updateActivitiesParamsValidator
} from "src/validators/activities/update-activities";
import {updateActivities} from "src/services/domain/activities.service";

export const updateActivitiesController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const params = updateActivitiesParamsValidator.parse(req.params);
    const activities = updateActivitiesBodyValidator.parse(req.body).activities;
    const result = await updateActivities(userId,params.tripId, params.dayId, activities)
    return res.status(200).json(result);
}