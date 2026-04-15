import {Response} from 'express';

interface ActivityResponse {
    tripId: string
    title: string
    description: string | null
    location: string | null
    startTime: Date
    endTime: Date
    id: string
    createdAt: Date
    createdById: string
    tripDayId: string
}

const activityClients = new Map<string, Array<{ userId: string; res: Response }>>();

export function addClient(activityId: string, userId: string, res: Response) {
  if (!activityClients.has(activityId)) {
    activityClients.set(activityId, []);
  }

  activityClients.get(activityId)!.push({ userId, res });
}

export function removeClient(activityId: string, res: Response) {
  const clients = activityClients.get(activityId) || [];

  activityClients.set(
    activityId,
    clients.filter((c) => c.res !== res)
  );
}

export function notifyActivityUpdated(activityId: string, activity: ActivityResponse, updatedBy: string) {
  const clients = activityClients.get(activityId) || [];

  clients.forEach((client) => {
    if (client.userId === updatedBy) return;

    client.res.write(`event: activityUpdated\n`);
    client.res.write(`data: ${JSON.stringify(activity)}\n\n`);
  });
}

setInterval(() => {
  activityClients.forEach((clients) => {
    clients.forEach((client) => {
      client.res.write(': keep-alive\n\n');
    });
  });
}, 20000);
