//Libary
import express from "express";
import "dotenv/config";
import logger from "morgan";
import cors from "cors";
import { readFile } from "fs/promises";
//Path
import authRouter from "./routes/auth-routers.js";
import swaggerUi from "swagger-ui-express";
//Swagger
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerPath = join(__dirname, "swagger.json");

const swaggerSpec = JSON.parse(await readFile(swaggerPath, "utf8"));

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/api/users", authRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).json({ message: "Not found path" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});
export default app;
