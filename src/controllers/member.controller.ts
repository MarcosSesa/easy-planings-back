import {RequestHandler} from "express";
import {createMember} from "src/services/member.service";
import {crateMemberValidator} from "src/validators/member/createMember";

export const createMemberController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const body = crateMemberValidator.parse(req.body)
    const createdMember = await createMember(userId, body.email, body.tripId)
    return res.status(201).json(createdMember);
}