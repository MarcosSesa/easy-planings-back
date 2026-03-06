import {ActivityInterface} from "src/validators/activities/update-activities";
import {prismaService} from "src/services/prisma.service";
import {CustomError} from "src/util/custom-error.util";

export const updateActivities = async (userId: string, tripId: string, dayId: string, activities: ActivityInterface[]) => {
    const trip = await prismaService.trip.findUnique({where: {id: tripId}, include: {members: true}});
    if (!trip) throw new CustomError("There isn't any trip with the provided tripId", 404);

    const member = trip.members.find((member) => member.userId === userId);
    if (!member) throw new CustomError("You are not a member of the trip", 401);

    const day = await prismaService.tripDay.findUnique({where: {id: dayId}});
    if (!day) throw new CustomError("You are trying to edit a day that not exist", 404);


    const newActivities = activities.filter(activity => !activity.activityId).map(activity => ({...activity, createdById: userId, tripId: tripId, tripDayId: dayId }));
    const updatedActivities = activities.filter(activity => activity.activityId).map(activity => ({...activity, createdById: userId, tripId: tripId, tripDayId: dayId }));

    if (newActivities.length > 0) {
        await prismaService.activity.createMany({ data: newActivities });
    }

    if (updatedActivities.length > 0) {
        await prismaService.$transaction(
            updatedActivities.map((activity) =>
                prismaService.activity.update({
                    where: { id: activity.activityId },
                    data: {
                        title: activity.title,
                        description: activity.description,
                        location: activity.location,
                        startTime: activity.startTime,
                        endTime: activity.endTime,
                    },
                })
            )
        );
    }

    return { created: newActivities.length, updated: updatedActivities.length };
}

export const deleteActivity = async (userId: string, tripId: string, dayId: string, activityId: string) => {
    const trip = await prismaService.trip.findUnique({where: {id: tripId}, include: {members: true}});
    if (!trip) throw new CustomError("There isn't any trip with the provided tripId", 404);

    const member = trip.members.find((member) => member.userId === userId);
    if (!member) throw new CustomError("You are not a member of the trip", 401);

    const day = await prismaService.tripDay.findUnique({where: {id: dayId}});
    if (!day) throw new CustomError("You are trying to edit a day that not exist", 404);


    return prismaService.activity.delete({where: {id: activityId}});
}