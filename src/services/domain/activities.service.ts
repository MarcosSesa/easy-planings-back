import {ActivityInterface} from "src/validators/activities/update-activities";
import {prismaService} from "src/services/prisma.service";
import {CustomError} from "src/util/custom-error.util";
import {notifyActivityUpdated} from "src/services/domain/activity-sse.service";

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
        const updatedResults = await prismaService.$transaction(
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
        updatedResults.forEach(result => notifyActivityUpdated(result.id, result, userId));
    }

    return { created: newActivities.length, updated: updatedActivities.length };
}

export const upsertActivity = async (userId: string, tripId: string, dayId: string, activity: ActivityInterface) => {
    const trip = await prismaService.trip.findUnique({where: {id: tripId}, include: {members: true}});
    if (!trip) throw new CustomError("There isn't any trip with the provided tripId", 404);

    const member = trip.members.find((member) => member.userId === userId);
    if (!member) throw new CustomError("You are not a member of the trip", 401);

    const day = await prismaService.tripDay.findUnique({where: {id: dayId}});
    if (!day) throw new CustomError("You are trying to edit a day that not exist", 404);

    if (!activity.activityId) {
        // Create new activity
        const result = await prismaService.activity.create({
            data: {
                title: activity.title,
                description: activity.description,
                location: activity.location,
                startTime: activity.startTime,
                endTime: activity.endTime,
                createdById: userId,
                tripId: tripId,
                tripDayId: dayId
            }
        });
        notifyActivityUpdated(result.id, result, userId);
        return result;
    } else {
        // Update existing activity
        const result = await prismaService.activity.update({
            where: { id: activity.activityId },
            data: {
                title: activity.title,
                description: activity.description,
                location: activity.location,
                startTime: activity.startTime,
                endTime: activity.endTime,
            }
        });
        notifyActivityUpdated(result.id, result, userId);
        return result;
    }
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