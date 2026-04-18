import {Response} from 'express';

interface TripDayResponse {
    id: string;
    date: Date;
    tripId: string;
    activities: Array<{
        id: string;
        title: string;
        description: string | null;
        location: string | null;
        startTime: Date;
        endTime: Date;
        createdAt: Date;
        createdById: string;
        tripId: string;
        tripDayId: string;
    }>;
}

const tripDayClients = new Map<string, Array<{ userId: string; res: Response }>>();

export function addClient(tripDayId: string, userId: string, res: Response) {
  if (!tripDayClients.has(tripDayId)) {
    tripDayClients.set(tripDayId, []);
  }

  tripDayClients.get(tripDayId)!.push({ userId, res });
}

export function removeClient(tripDayId: string, res: Response) {
  const clients = tripDayClients.get(tripDayId) || [];

  tripDayClients.set(
    tripDayId,
    clients.filter((c) => c.res !== res)
  );
}

export function notifyTripDayUpdated(tripDayId: string, tripDay: TripDayResponse, updatedBy: string) {
  const clients = tripDayClients.get(tripDayId) || [];

  clients.forEach((client) => {
    if (client.userId === updatedBy) return;

    client.res.write(`event: tripDayUpdated\n`);
    client.res.write(`data: ${JSON.stringify(tripDay)}\n\n`);
  });
}

setInterval(() => {
  tripDayClients.forEach((clients) => {
    clients.forEach((client) => {
      client.res.write(': keep-alive\n\n');
    });
  });
}, 20000);
