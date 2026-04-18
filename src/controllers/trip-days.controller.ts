import {RequestHandler} from "express";
import {getTripDaysByIdParamValidator} from "src/validators/trip-days/all-days";
import {getTripDayById, getTripDaysByTripId} from "src/services/domain/trip-days.service";
import {getTripDayByIdParamValidator} from "src/validators/trip-days/day-by-id";
import {addClient, removeClient} from "src/services/domain/trip-day-sse.service";

export const getTripDaysByTripIdController: RequestHandler = async (req, res) => {
    const params = getTripDaysByIdParamValidator.parse(req.params);
    const userId = req.user!.id;
    const tripDays = await getTripDaysByTripId(userId, params.tripId);
    return res.status(200).json({message: 'OK' , data: tripDays})
}


export const getTripDayByIdController: RequestHandler = async (req, res) => {
    const params = getTripDayByIdParamValidator.parse(req.params);
    const userId = req.user!.id;
    const tripDay = await getTripDayById(userId, params.tripId, params.id);
    return res.status(200).json({message: 'OK' , data: tripDay})
}

export const streamTripDayController: RequestHandler = (req, res) => {
    const params = getTripDayByIdParamValidator.parse(req.params);
    const tripDayId = params.id;
    const userId = req.user!.id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders();

    addClient(tripDayId, userId, res);

    res.write('data: connected\n\n');

    req.on('close', () => {
        removeClient(tripDayId, res);
    });
}
