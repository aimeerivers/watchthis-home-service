import assert from "node:assert";
import type { Server } from "node:http";
import { after, before, describe, it } from "node:test";

import request from "supertest";

import { app } from "../src/app.js";

const port = 17279;
let server: Server;
describe("App", () => {
  before(() => {
    server = app.listen(port);
  });

  describe("Home", () => {
    it("should show the home page", async () => {
      const res = await request(app).get("/");
      assert.ok(res.text.includes("Welcome to Watch This!"));
    });
  });

  describe("Ping", () => {
    it("should respond to a ping", async () => {
      const res = await request(app).get("/ping");
      assert.equal(res.statusCode, 200);
    });
  });

  after(async () => {
    server.close();
  });
});
