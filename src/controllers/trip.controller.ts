import {RequestHandler} from "express";
import {crateTripValidator} from "src/validators/trip/createTrip";
import {createTrip, deleteTrip, getTripById, getTripsList, updateTrip} from "src/services/trip.service";
import {deleteTripValidator} from "src/validators/trip/deleteTrip";
import {updateTripBodyValidator, updateTripParamValidator} from "src/validators/trip/updateTrip";

export const createTripController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;

    const tripData = crateTripValidator.parse(req.body);
    const tripCreated = await createTrip(tripData, userId);

    return res.status(201).json({message: "Trip successfully created", tripCreated});
}

export const deleteTripController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tripId = deleteTripValidator.parse(req.params).id;

    const deleted = await deleteTrip(tripId, userId);

    return res.status(200).json({message: "Trip successfully deleted", deleted});
}

export const updateTripController: RequestHandler = async (req, res) => {
    const tripId = updateTripParamValidator.parse(req.params).id;
    const userId = req.user!.id;
    const tripData = updateTripBodyValidator.parse(req.body);

    const updated = await updateTrip(tripData, tripId, userId);

    return res.status(200).json({message: "Trip successfully updated", updated});
}

export const getTripsController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const userTrips = await getTripsList(userId)
    return res.status(200).json({trips: userTrips});
}

export const getTripByIdController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tripId = updateTripParamValidator.parse(req.params).id;

    const trip = await getTripById(tripId,userId)

    return res.status(200).json({trip: trip});

}