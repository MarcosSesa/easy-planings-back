import {Router} from "express";
import {JwtAuthMiddleware} from "src/midelwares/jwt-auth.middleware";
import {
    acceptMembershipController,
    createMemberController,
    listPendingMembershipController
} from "src/controllers/member.controller";

const router = Router();

router.post("/invite",JwtAuthMiddleware, createMemberController);
router.put("/resolve-membership",JwtAuthMiddleware, acceptMembershipController);
router.get("/invitations",JwtAuthMiddleware, listPendingMembershipController );


export const memberRouter = router;
