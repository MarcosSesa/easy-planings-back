import {Response} from 'express';

// Activity response interface sent to SSE clients when activity is updated
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

// Global map storing active SSE connections: Map<activityId, Array<{ userId, response }>>
const activityClients = new Map<string, Array<{ userId: string; res: Response }>>();

// Step 1: Register a new SSE client connection for an activity
export function addClient(activityId: string, userId: string, res: Response) {
  if (!activityClients.has(activityId)) {
    activityClients.set(activityId, []);
  }
  activityClients.get(activityId)!.push({ userId, res });
}

// Step 2: Unregister a client connection when SSE stream closes
export function removeClient(activityId: string, res: Response) {
  const clients = activityClients.get(activityId) || [];
  activityClients.set(
    activityId,
    clients.filter((c) => c.res !== res)
  );
}

// Step 3: Broadcast activity updates to all connected SSE clients except the updater
export function notifyActivityUpdated(activityId: string, activity: ActivityResponse, updatedBy: string) {
  const clients = activityClients.get(activityId) || [];

  clients.forEach((client) => {
    if (client.userId === updatedBy) return;

    client.res.write(`event: activityUpdated\n`);
    client.res.write(`data: ${JSON.stringify(activity)}\n\n`);
  });
}

// Step 4: Send periodic keep-alive signals every 20 seconds to maintain SSE connections
setInterval(() => {
  activityClients.forEach((clients) => {
    clients.forEach((client) => {
      client.res.write(': keep-alive\n\n');
    });
  });
}, 20000);
