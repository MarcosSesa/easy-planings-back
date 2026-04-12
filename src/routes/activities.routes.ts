import {Router} from "express";
import {JwtAuthMiddleware} from "src/midelwares/jwt-auth.middleware";
import {deleteActivityController, updateActivitiesController, upsertActivityController} from "src/controllers/activities.controller";

const router = Router({mergeParams: true});

router.post('/update-activities', JwtAuthMiddleware, updateActivitiesController)
router.post('/upsert-activity', JwtAuthMiddleware, upsertActivityController)
router.delete('/:activityId/delete-activity', JwtAuthMiddleware, deleteActivityController)

export const activitiesRouter = router