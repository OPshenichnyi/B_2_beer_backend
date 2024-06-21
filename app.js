//Libary
import express from "express";
import "dotenv/config";
import logger from "morgan";
import cors from "cors";
import { readFile } from "fs/promises";
import path from "path";
//Path
import authRouter from "./routes/auth-routers.js";
import swaggerUi from "swagger-ui-express";
//Swagger
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const swaggerPath = path.join(__dirname, "swagger.json");

let swaggerSpec;

async function loadSwagger() {
  try {
    const data = await readFile(swaggerPath, "utf8");
    swaggerSpec = JSON.parse(data);
  } catch (error) {
    console.error("Error reading swagger.json:", error);
    process.exit(1); // Завершуємо процес з помилкою
  }
}
try {
  const data = await readFile(swaggerPath, "utf8");
  swaggerSpec = JSON.parse(data);
} catch (error) {
  console.error("Error reading swagger.json:", error);
  process.exit(1); // Завершуємо процес з помилкою
}
await loadSwagger();

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
