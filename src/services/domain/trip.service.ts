import {prismaService} from "src/services/prisma.service";
import {CustomError} from "src/util/custom-error.util";

type TripData = {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
}

export const createTrip = async (tripData: TripData, userId: string) => {
    return prismaService.$transaction(async (tx) => {
        const trip = await tx.trip.create({
            data: {
                title: tripData.title,
                description: tripData.description,
                startDate: tripData.startDate,
                endDate: tripData.endDate,
                createdById: userId,
            },
        });

        await tx.tripMember.create({
            data: {
                tripId: trip.id,
                userId: userId,
                role: "OWNER",
                status: "ACCEPTED",
                joinedAt: new Date(),
            },
        });

        const days: { date: Date; tripId: string }[] = [];

        const currentDate = tripData.startDate;
        const endDate = tripData.endDate;

        while (currentDate <= endDate) {
            days.push({
                date: new Date(currentDate),
                tripId: trip.id,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        console.log(days)

        await tx.tripDay.createMany({
            data: days,
        });

        return trip;
    });
};

export const deleteTrip = async (tripId: string, userId: string) => {
    const trip = await prismaService.trip.findUnique({
        where: {id: tripId}
    });

    if (!trip) throw new CustomError("There is no trip with the provided id", 400);
    if (trip.createdById !== userId) throw new CustomError("Only the creator of the trip can delete it", 401);

    return prismaService.trip.delete({where: {id: tripId}});
}

export const updateTrip = async (tripData: TripData, tripId: string, userId: string) => {
    const trip = await prismaService.trip.findUnique({where: { id: tripId },});

    if (!trip) throw new CustomError("Trip not found", 404);

    const membership = await prismaService.tripMember.findUnique({
        where: {tripId_userId: { tripId, userId },},
        select: { role: true, status: true },
    });

    if (!membership || membership.status !== "ACCEPTED") throw new CustomError("You are not a member of this trip", 401);


    return  prismaService.trip.update({
        where: {id: tripId},
        data: {
            title: tripData.title,
            description: tripData.description,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
        },
    });
};

export const getTripsList = async (userId: string, filter?: "past" | "current" | "future") => {
    const now = new Date();

    const whereClause: {
        members: { some: { userId: string; status: "ACCEPTED" } };
        startDate?: { gt?: Date; lte?: Date };
        endDate?: { gte?: Date; lt?: Date };
    } = {
        members: {some: {userId: userId, status: "ACCEPTED"}}
    };

    if (filter === "past") {
        whereClause.endDate = {lt: now};
    }

    if (filter === "future") {
        whereClause.startDate = {gt: now};
    }

    if (filter === "current") {
        whereClause.startDate = {lte: now};
        whereClause.endDate = {gte: now};
    }

    return prismaService.trip.findMany({where: whereClause})
}

export const getTripById = async (tripId: string, userId: string) => {
    const trip = await prismaService.trip.findUnique({
        where: {id: tripId},
        include: {members: true}
    });
    if (!trip) throw new CustomError("There is no trip with the provided id", 400);

    const membership = trip.members.find((member) => member.userId === userId && member.status === "ACCEPTED");

    if (!membership) { throw new CustomError("Only the members of the trip can see it", 401);}

    return trip;
}