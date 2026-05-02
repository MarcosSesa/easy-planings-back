// noinspection LanguageDetectionInspection

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

    // Step 1: Create trip in database with auto-generated trip days
    const createdTrip = await createTrip(tripData, userId);

    // Step 2: Build structured prompt for Gemini AI with trip details and constraints
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

    // Step 3: Call Gemini API with structured JSON output using Zod schema validation
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(activitiesSchema as any),
        },
    });

    // Step 4: Parse and validate response against activity schema
    const activities = activitiesSchema.parse(JSON.parse(response.text ?? ''));

    // Step 5: Fetch all trip days for the created trip from database
    const tripDays = await prismaService.tripDay.findMany({
        where: {tripId: createdTrip.id},
        select: {id: true, date: true}
    });

    // Step 6: Map trip day dates (YYYY-MM-DD) to their IDs for quick lookup
    const dateToTripDayId = new Map<string, string>();
    tripDays.forEach(day => {
        const dateKey = day.date.toISOString().split('T')[0]; // YYYY-MM-DD
        dateToTripDayId.set(dateKey, day.id);
    });

    // Step 7: Create activities in database, matching each to its corresponding trip day by date
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

    // Step 8: Return created trip with all auto-generated activities assigned to trip days
    return createdTrip;
}
