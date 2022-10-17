import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectRedis from "connect-redis";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRouter from "./routes/user.router.js";
import { ApolloServer } from "apollo-server-express";
import { corsOption } from "./common/corsOption.js";
import { readFileSync } from "fs";
import { resolvers } from "./graphql/index.js";
import DB from "./connection/mysql2.js";
import expressPlayground from "graphql-playground-middleware-express";

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;
const Redis = connectRedis(session);
const RedisStore = new Redis({ url: "redis://localhost" });
const typeDefs = readFileSync("./src/graphql/typeDefs.graphql", "UTF-8");

const start = async () => {
  const context = { DB };
  const apolloServer = new ApolloServer({ typeDefs, resolvers, context });
  const graphqlPlayground = expressPlayground.default;

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan("dev"));
  app.use(cors(corsOption));
  app.use(cookieParser("secret"));
  app.use(
    session({
      secret: "secret",
      saveUninitialized: true,
      resave: true,
      store: RedisStore,
    })
  );

  app.use((req, res, next) => {
    if (req.session.pageCount) req.session.pageCount++;
    else req.session.pageCount = 1;
    next();
  });
  app.get("/playground", graphqlPlayground({ endpoint: "/graphql" }));
  app.use("/api", [userRouter]);

  app.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`);
  });
};

start();
