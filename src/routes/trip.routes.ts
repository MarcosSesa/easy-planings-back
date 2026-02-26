import {Router} from "express";
import {
    createTripController,
    deleteTripController,
    getTripByIdController,
    getTripsController,
    updateTripController
} from "src/controllers/trip.controller";
import {JwtAuthMiddleware} from "src/midelwares/jwt-auth.middleware";

const router = Router();

router.post("/create",JwtAuthMiddleware, createTripController);
router.delete("/delete/:id",JwtAuthMiddleware, deleteTripController);
router.put("/update/:id",JwtAuthMiddleware, updateTripController);
router.get("/trips",JwtAuthMiddleware, getTripsController);
router.get("/:id",JwtAuthMiddleware,  getTripByIdController);

export const tripRouter = router;
