import {prismaService} from "src/services/prisma.service";
import {CustomError} from "src/util/custom-error.util";

export const getTripDaysByTripId = async (userId: string, tripId: string) => {
    const userMember = await prismaService.tripMember.findUnique({
        where: {
            tripId_userId: {
                tripId: tripId,
                userId: userId
            }
        }
    })
    if (!userMember) throw new CustomError('Only the member of the trip can see the days', 401)
    return prismaService.tripDay.findMany({
        where: {tripId: tripId},
        orderBy: {date: 'asc'},
    })
}

export const getTripDayById = async (userId: string, tripId: string, dayId: string) => {
    const userMember = await prismaService.tripMember.findUnique({
        where: {
            tripId_userId: {
                tripId: tripId,
                userId: userId
            }
        }
    })
    if (!userMember) throw new CustomError('Only the member of the trip can see the days', 401)
    return prismaService.tripDay.findUnique({
        where: {id: dayId},
        include: {activities: true}
    })
}