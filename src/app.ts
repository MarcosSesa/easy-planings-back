import express from "express";
import cors from "cors";
import {authRouter} from "./routes/auth.routes";
import {zodErrorHandler} from "src/handlers/zod-error.handler";
import {globalErrorHandler} from "src/handlers/global-error.handler";
import {tripRouter} from "src/routes/trip.routes";
import {jwtErrorHandler} from "src/handlers/jwt-error.handler";
import {tripMemberRouter} from "src/routes/trip-member.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/trip", tripRouter);
app.use("/members", tripMemberRouter);


app.use(zodErrorHandler);
app.use(jwtErrorHandler);
app.use(globalErrorHandler)

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
