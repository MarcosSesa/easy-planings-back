import {RequestHandler} from "express";
import {acceptMember, createMember, listPendingMembers} from "src/services/domain/member.service";
import {crateMemberValidator} from "src/validators/member/create-member";
import {acceptMemberValidator} from "src/validators/member/accept-member";

export const createMemberController: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const body = crateMemberValidator.parse(req.body)
    const createdMember = await createMember(userId, body.email, body.tripId)
    return res.status(201).json(createdMember);
}

export const acceptMembershipController: RequestHandler = async (req, res) => {
    const userId = req.user!.id
    const body = acceptMemberValidator.parse(req.body)
    const acceptedMember = await acceptMember(userId, body.memberId, body.status)
    return res.status(200).json(acceptedMember);
}

export const listPendingMembershipController: RequestHandler = async (req, res) => {
    const userId = req.user!.id
    const invitations = await listPendingMembers(userId)
    return res.status(200).json(invitations);
}