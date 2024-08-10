import { path as appRootPath } from "app-root-path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import { findUserFromSession, RequestWithUser } from "./authentication";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "pug");
app.set("views", path.join(appRootPath, "views"));
app.use(express.static(path.join(appRootPath, "public")));

app.get("/", findUserFromSession, (req: RequestWithUser, res) => {
  res.render("home-page", { user: req.user });
});

export { app };
