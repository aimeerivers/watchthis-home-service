import { path as appRootPath } from "app-root-path";
import dotenv from "dotenv";
import express from "express";
import path from "path";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", path.join(appRootPath, "views"));
app.use(express.static(path.join(appRootPath, "public")));

app.get("/", (req, res) => {
  res.render("home-page");
});

export { app };
