import express from "express";
import cors from "cors";
import {configDotenv} from "dotenv";
import {authRouter} from "./routes/auth.routes";
import {zodErrorHandler} from "src/handlers/zod-error.handler";
import {globalErrorHandler} from "src/handlers/global-error.handler";
import {tripRouter} from "src/routes/trip.routes";
import {jwtErrorHandler} from "src/handlers/jwt-error.handler";
import {memberRouter} from "src/routes/member.routes";
import {tripDayRouter} from "src/routes/trip-days.routes";
import {activitiesRouter} from "src/routes/activities.routes";

configDotenv();

const app = express();

app.use(express.json());
app.use(cors({
    allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use("/auth", authRouter);
app.use("/trip", tripRouter);
app.use("/members", memberRouter);
app.use("/:tripId/days", tripDayRouter)
app.use("/:tripId/days/:dayId/activities", activitiesRouter)


app.use(zodErrorHandler);
app.use(jwtErrorHandler);
app.use(globalErrorHandler)

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
