import {RequestHandler} from "express";
import {
    updateActivitiesBodyValidator,
    updateActivitiesParamsValidator
} from "src/validators/activities/update-activities";
import {deleteActivity, updateActivities} from "src/services/domain/activities.service";
import {deleteActivityParamsValidator} from "src/validators/activities/delete-activity";

export const updateActivitiesController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const params = updateActivitiesParamsValidator.parse(req.params);
    const activities = updateActivitiesBodyValidator.parse(req.body).activities;
    const result = await updateActivities(userId, params.tripId, params.dayId, activities)
    return res.status(200).json({message: 'Successfully updated activities', data: {created: result.created, updated: result.updated}});
}

export const deleteActivityController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const params = deleteActivityParamsValidator.parse(req.params);
    const result = await deleteActivity(userId, params.tripId, params.dayId, params.activityId)
    return res.status(200).json({message: 'Activity successfully deleted', data:  result});
}