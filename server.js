import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
      console.log("Server runing on 4000 PORT");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
