import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { corsOption } from "./common/corsOption.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors(corsOption));

app.listen(3000, () => {
  console.log("The server is on");
});

/**
 * TODO: mysql connection
 * TODO: redis connection
 * TODO: graphql connection
 */
