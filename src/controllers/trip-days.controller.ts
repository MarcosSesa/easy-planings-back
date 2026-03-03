import {RequestHandler} from "express";
import {getTripDaysByIdParamValidator} from "src/validators/trip-days/all-days";
import {getTripDayById, getTripDaysByTripId} from "src/services/domain/trip-days.service";
import {getTripDayByIdParamValidator} from "src/validators/trip-days/day-by-id";

export const getTripDaysByTripIdController: RequestHandler = async (req, res) => {
    const params = getTripDaysByIdParamValidator.parse(req.params);
    const userId = req.user!.id;
    const tripDays = await getTripDaysByTripId(userId, params.tripId);
    return res.status(200).json(tripDays)
}


export const getTripDayByIdController: RequestHandler = async (req, res) => {
    const params = getTripDayByIdParamValidator.parse(req.params);
    const userId = req.user!.id;
    const tripDay = await getTripDayById(userId, params.tripId, params.id);
    return res.status(200).json(tripDay)
}