import {Router} from "express";
import {getTripsController} from "src/controllers/trip.controller";

const router = Router();

router.post("/create", getTripsController);
router.put("/update", getTripsController);


export const tripMemberRouter = router;
