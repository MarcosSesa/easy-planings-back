import {prismaService} from "src/services/prisma.service";
import {CustomError} from "src/util/custom-error.util";
import {CreateTripData} from "src/types/trip.types";


const buildTripDaysRange = (startDate: Date, endDate: Date, tripId: string) => {
    const days: { date: Date; tripId: string }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        days.push({
            date: new Date(currentDate),
            tripId,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
};

export const createTrip = async (tripData: CreateTripData, userId: string) => {
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

        const days = buildTripDaysRange(tripData.startDate, tripData.endDate, trip.id);

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

export const updateTrip = async (tripData: CreateTripData, tripId: string, userId: string) => {
    const trip = await prismaService.trip.findUnique({where: { id: tripId },});

    if (!trip) throw new CustomError("Trip not found", 404);
    if (trip.createdById !== userId) throw new CustomError("Only the creator of the trip can update it", 401);

    const membership = await prismaService.tripMember.findUnique({
        where: {tripId_userId: { tripId, userId },},
        select: { role: true, status: true },
    });

    if (!membership || membership.status !== "ACCEPTED") throw new CustomError("You are not a member of this trip", 401);
    if (tripData.endDate < tripData.startDate) throw new CustomError("Invalid date format, startDate cannot be lower than endDate", 400);

    return prismaService.$transaction(async (tx) => {
        const updatedTrip = await tx.trip.update({
            where: {id: tripId},
            data: {
                title: tripData.title,
                description: tripData.description,
                startDate: tripData.startDate,
                endDate: tripData.endDate,
            },
        });

        const expectedDays = buildTripDaysRange(tripData.startDate, tripData.endDate, tripId);
        const expectedDayTimestamps = new Set(expectedDays.map((day) => day.date.getTime()));

        const existingDays = await tx.tripDay.findMany({
            where: {tripId},
            select: {id: true, date: true},
        });

        const existingDayTimestamps = new Set(existingDays.map((day) => day.date.getTime()));

        const dayIdsToDelete = existingDays
            .filter((day) => !expectedDayTimestamps.has(day.date.getTime()))
            .map((day) => day.id);

        const daysToCreate = expectedDays
            .filter((day) => !existingDayTimestamps.has(day.date.getTime()));

        if (dayIdsToDelete.length > 0) {
            await tx.tripDay.deleteMany({
                where: {id: {in: dayIdsToDelete}},
            });
        }

        if (daysToCreate.length > 0) {
            await tx.tripDay.createMany({
                data: daysToCreate,
            });
        }

        return updatedTrip;
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
        include: {members: {where: {status: 'ACCEPTED'},include: {user: {select: {id: true, email: true, name: true}}}}}
    });
    if (!trip) throw new CustomError("There is no trip with the provided id", 400);

    const membership = trip.members.find((member) => member.userId === userId && member.status === "ACCEPTED");

    if (!membership) { throw new CustomError("Only the members of the trip can see it", 401);}

    return trip;
}