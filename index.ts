import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user";
import { connectDB } from "./config/dbConnection";

dotenv.config();

connectDB();

const app: Express = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
