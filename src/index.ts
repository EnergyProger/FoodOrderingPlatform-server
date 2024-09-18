import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION as string)
  .then(() => console.log("Connected to database!"));

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", async (request: Request, response: Response) => {
  response.send({ message: "Health OK!" });
});

app.use("/api/my/user", myUserRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
