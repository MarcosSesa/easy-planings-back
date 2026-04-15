import {RequestHandler} from "express";
import {
    updateActivitiesBodyValidator,
    updateActivitiesParamsValidator
} from "src/validators/activities/update-activities";
import {deleteActivity, updateActivities, upsertActivity} from "src/services/domain/activities.service";
import {deleteActivityParamsValidator} from "src/validators/activities/delete-activity";
import {upsertActivityBodyValidator, upsertActivityParamsValidator} from "src/validators/activities/upsert-activity";
import {addClient, removeClient} from "src/services/domain/activity-sse.service";
import {streamActivitiesParamsValidator} from "src/validators/activities/stream-activity";

export const updateActivitiesController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const params = updateActivitiesParamsValidator.parse(req.params);
    const activities = updateActivitiesBodyValidator.parse(req.body).activities;
    const result = await updateActivities(userId, params.tripId, params.dayId, activities)
    return res.status(200).json({message: 'Successfully updated activities', data: {created: result.created, updated: result.updated}});
}

export const upsertActivityController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const params = upsertActivityParamsValidator.parse(req.params);
    const activity = upsertActivityBodyValidator.parse(req.body);
    const result = await upsertActivity(userId, params.tripId, params.dayId, activity)
    return res.status(200).json({message: 'Activity successfully created or updated', data: result});
}

export const deleteActivityController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const params = deleteActivityParamsValidator.parse(req.params);
    const result = await deleteActivity(userId, params.tripId, params.dayId, params.activityId)
    return res.status(200).json({message: 'Activity successfully deleted', data:  result});
}

export const streamActivityController: RequestHandler = (req, res) => {
    const params = streamActivitiesParamsValidator.parse(req.params);
    const activityId = params.activityId;
    const userId = req.user!.id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders();

    addClient(activityId, userId, res);

    res.write('data: connected\n\n');

    req.on('close', () => {
        removeClient(activityId, res);
    });
}
