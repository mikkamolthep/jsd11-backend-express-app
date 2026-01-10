import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../app.js";
import {User} from "../../modules/users/users.model.js";

describe("POST /api/v2/users", () => {
  beforeEach(async () => {
    // Clean DB to avoid duplicate email errors
    await User.deleteMany({});
  });

  it("should create a new user successfully", async () => {
    const payload = {
      username: "test1",
      email: "test1@example.com",
      password: "12345678",
      role: "user",
    };

    const res = await request(app).post("/api/v2/users").send(payload);

    // HTTP status
    expect(res.status).toBe(201);

    // Response shape (adjust if your API differs)
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("username", "test1");
    expect(res.body.data).toHaveProperty("email", "test1@example.com");
    expect(res.body.data).toHaveProperty("role", "user");

    // Password should NEVER be returned
    expect(res.body.data).not.toHaveProperty("password");

    // Verify DB state
    const userInDb = await User.findOne({ email: "test1@example.com" });
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe("test1");
    expect(userInDb.role).toBe("user");
  });
});
