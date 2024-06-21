//Libary
import express from "express";
import "dotenv/config";
import logger from "morgan";
import cors from "cors";
import { readFile } from "fs/promises";
import path from "path";
import swaggerUi from "swagger-ui-express";

//Path
import authRouter from "./routes/auth-routers.js";

//Swagger
let swaggerSpec;

async function loadSwagger() {
  try {
    const swaggerDocument = JSON.parse(await readFile("./swagger.json"));
    swaggerSpec = swaggerDocument;
  } catch (error) {
    console.error("Error reading swagger.json:", error);
    process.exit(1); // Завершуємо процес з помилкою
  }
}

await loadSwagger(); // Завантажуємо swaggerSpec перед налаштуванням маршруту

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found path" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

export default app;
