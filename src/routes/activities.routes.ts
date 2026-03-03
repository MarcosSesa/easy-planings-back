import {Router} from "express";
import {JwtAuthMiddleware} from "src/midelwares/jwt-auth.middleware";
import {updateActivitiesController} from "src/controllers/activities.controller";

const router = Router({mergeParams: true});

router.post('/update-activities', JwtAuthMiddleware, updateActivitiesController)
router.delete('/delete-activity', JwtAuthMiddleware)

export const activitiesRouter = router