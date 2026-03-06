import {RequestHandler} from "express";
import {crateTripValidator} from "src/validators/trip/create-trip";
import {createTrip, deleteTrip, getTripById, getTripsList, updateTrip} from "src/services/domain/trip.service";
import {deleteTripValidator} from "src/validators/trip/delete-trip";
import {updateTripBodyValidator, updateTripParamValidator} from "src/validators/trip/update-trip";

export const createTripController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;

    const tripData = crateTripValidator.parse(req.body);
    if(tripData.endDate < tripData.startDate)return res.status(400).send({error: "Invalid date format, startDate cannot be lower than endDate"});
    const tripCreated = await createTrip(tripData, userId);

    return res.status(201).json({message: "Trip successfully created", data: tripCreated});
}

export const deleteTripController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tripId = deleteTripValidator.parse(req.params).id;

    const deleted = await deleteTrip(tripId, userId);

    return res.status(200).json({message: "Trip successfully deleted", data: deleted});
}

export const updateTripController: RequestHandler = async (req, res) => {
    const tripId = updateTripParamValidator.parse(req.params).id;
    const userId = req.user!.id;
    const tripData = updateTripBodyValidator.parse(req.body);

    const updated = await updateTrip(tripData, tripId, userId);

    return res.status(200).json({message: "Trip successfully updated", data: updated});
}

export const getTripsController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const userTrips = await getTripsList(userId)
    return res.status(200).json({message: 'Ok',data: userTrips});
}

export const getTripByIdController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tripId = updateTripParamValidator.parse(req.params).id;

    const trip = await getTripById(tripId,userId)

    return res.status(200).json({message: 'Ok',data:  trip});

}