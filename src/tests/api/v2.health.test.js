import { describe, it, expect } from "vitest";
import request from "supertest";
import {app} from "../../app.js";

describe("GET /api/v2/health", () => {
  it("should return API health status", async () => {
    const res = await request(app).get("/api/v2/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      error: false,
      message: "API is healthy -- ready to serve",
      data: null,
    });
  });
});
