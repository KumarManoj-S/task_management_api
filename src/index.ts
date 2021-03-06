import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import { labelRouter } from "./routes/label";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";
import categoryRouter from './routes/categories';
import secrets from "./config/secrets";
import { verifyToken } from './services/googleOAuth2'

dotenv.config();

dotenv.config();
const app = express();
const port = process.env.PORT || 5000; // default port to listen
const uri = process.env.ATLAS_URI;

app.use(cookieParser(secrets.COOKIE_SECRET));
app.use(cors({
  credentials: true, origin: [
    "http://tasks.com:3000",
    'https://tasks-manager-web-app.herokuapp.com',
    'https://eazytasks.herokuapp.com'
  ]
}));

const validateToken = async (req: express.Request, res: express.Response, next: () => void) => {
  try {
    const authToken = req.cookies.authToken;
    const userId = await verifyToken(authToken);
    res.locals.userId = userId;
    next();
  } catch (err) {
    console.log(err)
    res.status(401).send("Invalid token");
  }
}

mongoose
  .connect(uri, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("mongo connection established successfully"))
  .catch((err: any) => console.log(err));

app.use(express.json());
app.use("/oauth2", authRouter);
app.use("/label", validateToken, labelRouter);
app.use("/tasks", validateToken, tasksRouter);
app.use("/categories", validateToken, categoryRouter);
// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`hoooHooo!! server started at http://localhost:${port}`);
});
