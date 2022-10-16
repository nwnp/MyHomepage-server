import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { corsOption } from "./common/corsOption.js";
import userRouter from "./routes/user.router.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors(corsOption));

app.use("/api", [userRouter]);

app.listen(3000, () => {
  console.log("The server is on");
});

/**
 * TODO: redis connection
 * TODO: graphql connection
 */
