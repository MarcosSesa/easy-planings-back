import {prismaService} from "src/services/prisma.service";
import {CustomError} from "src/util/custom-error.util";

export const createMember = async (userId: string, invitedUserEmail: string, tripId: string) => {
    const trip = await prismaService.trip.findUnique({where: {id: tripId},});
    if (!trip) throw new CustomError("Trip not found with the provided ID", 404);

    if (trip.createdById !== userId) throw new CustomError("You are not the owner of this trip", 401);

    const invitedUser = await prismaService.user.findUnique({where: {email: invitedUserEmail},});

    if (!invitedUser) throw new CustomError("Invited user does not exist", 404);
    console.log(invitedUser.id, userId);
    if (invitedUser.id === userId) throw new CustomError("You cannot invite yourself, DUMB", 400);

    const existingMember = await prismaService.tripMember.findUnique({
        where: {tripId_userId: {tripId, userId: invitedUser.id}},
    });

    if (existingMember) throw new CustomError("User is already a member of this trip", 409);

    return prismaService.tripMember.create({
        data: {
            tripId,
            userId: invitedUser.id,
            role: "MEMBER",
            status: "PENDING",
        },
    });
};

export const acceptMember = async (userId: string, memberId: string, status: "ACCEPTED" | "REJECTED") => {
    const member = await prismaService.tripMember.findUnique({where: {id: memberId}});
    if (!member) throw new CustomError("No member exists with this member id", 404);
    if (member.userId !== userId) throw new CustomError("You are not the invited user, you cant accept another users invitation.", 401);
    if (member.status !== "PENDING") throw new CustomError('The invitation has been already rejected or accepted', 409);
    return prismaService.tripMember.update({where: {id: memberId}, data: {status: status, joinedAt: new Date()}})
}

export const listPendingMembers = async (userId: string) => {
    console.log(userId)
    return prismaService.tripMember.findMany({
        where: {userId: userId, status: "PENDING"}, select: {
            id: true,
            role: true,
            invitedAt: true,
            tripId: true,
            trip: true
        }
    });
}