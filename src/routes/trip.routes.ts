import {Router} from "express";
import {
    createTripController,
    deleteTripController,
    getTripByIdController,
    getTripsController,
    updateTripController
} from "src/controllers/trip.controller";
import {JwtAuthMidelware} from "src/midelwares/jwt-auth.midelware";

const router = Router();

router.post("/create",JwtAuthMidelware, createTripController);
router.delete("/delete/:id",JwtAuthMidelware, deleteTripController);
router.put("/update/:id",JwtAuthMidelware, updateTripController);
router.get("/trips",JwtAuthMidelware, getTripsController);
router.get("/:id",JwtAuthMidelware,  getTripByIdController);

export const tripRouter = router;
