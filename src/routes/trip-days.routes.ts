import {Router} from "express";
import {JwtAuthMiddleware} from "src/midelwares/jwt-auth.middleware";
import {getTripDayByIdController, getTripDaysByTripIdController} from "src/controllers/trip-days.controller";

const router = Router({mergeParams: true});

router.get("",JwtAuthMiddleware, getTripDaysByTripIdController);
router.get("/:id",JwtAuthMiddleware,  getTripDayByIdController);

export const tripDayRouter = router;
