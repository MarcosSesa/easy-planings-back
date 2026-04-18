import {GoogleGenAI} from "@google/genai";
import {CreateTripData} from "src/types/trip.types";
import {createTrip} from "src/services/domain/trip.service";
import {array, object, string} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";
import {prismaService} from "src/services/prisma.service";
import {upsertActivity} from "src/services/domain/activities.service";

const ai = new GoogleGenAI({});

const activitySchema = object({
    title: string(),
    description: string(),
    location: string(),
    startTime: string().datetime(),
    endTime: string().datetime(),
});
const activitiesSchema = array(activitySchema);

export async function generateTrip(tripData: CreateTripData, userId: string) {

    const createdTrip = await createTrip(tripData, userId);

    const prompt = `
        Genera exactamente entre 5 y 8 actividades por cada día de un viaje a ${createdTrip.title} desde ${createdTrip.startDate} hasta ${createdTrip.endDate}.
        
        Cada día debe tener múltiples actividades distribuidas a lo largo del día (mañana, tarde y noche).
        
        Devuelve un array de actividades con:
        - title: máximo 50 caracteres
        - description: máximo 200 caracteres
        - location: máximo 100 caracteres; si es posible, incluye una URL de Google Maps
        - startTime (fecha en formato ISO)
        - endTime (fecha en formato ISO)
        
        IMPORTANTE:
        - Debes generar actividades para TODOS los días del rango
        - Cada día debe tener al menos 3 actividades
        - No agrupes actividades, deben ser individuales
        - Las fechas deben coincidir exactamente con los días del viaje
        
        La respuesta debe estar completamente en español.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(activitiesSchema as any),
        },
    });

    const activities = activitiesSchema.parse(JSON.parse(response.text ?? ''));

    const tripDays = await prismaService.tripDay.findMany({
        where: {tripId: createdTrip.id},
        select: {id: true, date: true}
    });

    const dateToTripDayId = new Map<string, string>();
    tripDays.forEach(day => {
        const dateKey = day.date.toISOString().split('T')[0]; // YYYY-MM-DD
        dateToTripDayId.set(dateKey, day.id);
    });

    for (const activity of activities) {
        const activityDate = new Date(activity.startTime).toISOString().split('T')[0];
        const tripDayId = dateToTripDayId.get(activityDate);

        if (tripDayId) {
            await upsertActivity(userId, createdTrip.id, tripDayId, {
                title: activity.title,
                description: activity.description,
                location: activity.location,
                startTime: new Date(activity.startTime),
                endTime: new Date(activity.endTime),
            });
        }
    }

    return createdTrip;
}
