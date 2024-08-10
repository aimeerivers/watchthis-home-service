import assert from "node:assert";
import type { Server } from "node:http";
import { after, before, describe, it } from "node:test";

import request from "supertest";

import { app } from "../src/app";

const port = 17283;
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

  after(async () => {
    server.close();
  });
});
