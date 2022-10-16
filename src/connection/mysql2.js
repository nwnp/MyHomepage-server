import mysql from "mysql2";
import { DB_CONFIG } from "./db_config.js";

const connection = mysql.createPool(DB_CONFIG);
const promisePool = connection.promise();

export default promisePool;
