import {Router} from "express";
import {JwtAuthMiddleware} from "src/midelwares/jwt-auth.middleware";
import {getTripDayByIdController, getTripDaysByTripIdController, streamTripDayController} from "src/controllers/trip-days.controller";

const router = Router({mergeParams: true});

router.get("",JwtAuthMiddleware, getTripDaysByTripIdController);
router.get("/:id",JwtAuthMiddleware,  getTripDayByIdController);
router.get("/:id/stream", JwtAuthMiddleware, streamTripDayController);

export const tripDayRouter = router;
