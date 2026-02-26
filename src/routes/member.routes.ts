import {Router} from "express";
import {JwtAuthMiddleware} from "src/midelwares/jwt-auth.middleware";
import {createMemberController} from "src/controllers/member.controller";

const router = Router();

router.post("/create",JwtAuthMiddleware, createMemberController);
router.put("/update",JwtAuthMiddleware, createMemberController);


export const memberRouter = router;
