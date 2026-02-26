import {prismaService} from "src/services/prisma.service";
import {CustomError} from "src/util/custom-error.util";

export const createMember = async (userId: string, invitedUserEmail: string, tripId: string) => {
    const trip = await prismaService.trip.findUnique({where: {id: tripId},});
    if (!trip) throw new CustomError("Trip not found with the provided ID", 404);

    if (trip.createdById !== userId) throw new CustomError("You are not the owner of this trip", 401);

    const invitedUser = await prismaService.user.findUnique({where: {email: invitedUserEmail},});

    if (!invitedUser) throw new CustomError("Invited user does not exist", 404);

    if (invitedUser.id === userId) throw new Error("You cannot invite yourself, DUMB");

    const existingMember = await prismaService.tripMember.findUnique({
        where: {tripId_userId: {tripId, userId: invitedUser.id}},
    });

    if (existingMember) throw new CustomError("User is already a member of this trip", 409);

    return  prismaService.tripMember.create({
        data: {
            tripId,
            userId: invitedUser.id,
            role: "MEMBER",
            status: "PENDING",
        },
    });
};