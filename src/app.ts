import express from "express";
import cors from "cors";
import {authRouter} from "./routes/auth.routes";
import {zodErrorHandler} from "src/handlers/zod-error.handler";
import {globalErrorHandler} from "src/handlers/global-error.handler";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

app.use(zodErrorHandler);
app.use(globalErrorHandler)

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
