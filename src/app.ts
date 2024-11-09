import appRootPath from "app-root-path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import packageJson from "../package.json" with { type: "json" };
import { findUserFromSession, RequestWithUser } from "./auth.js";

dotenv.config();

const baseUrl = process.env.BASE_URL ?? "http://localhost:7279";
const userServiceUrl = process.env.USER_SERVICE_URL ?? "http://localhost:8583";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "pug");
app.set("views", path.join(appRootPath.path, "views"));
app.use(express.static(path.join(appRootPath.path, "public")));

app.get("/", findUserFromSession, (req: RequestWithUser, res) => {
  res.render("home-page", { user: req.user, userServiceUrl, callbackUrl: new URL(req.url, baseUrl).toString() });
});

app.get("/ping", (_req, res) => {
  res.send(`${packageJson.name} ${packageJson.version}`);
});

export { app };
