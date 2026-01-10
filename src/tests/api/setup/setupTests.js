// tests/setup/setupTests.js

import { beforeAll, afterAll, afterEach } from "vitest";
import { startMongoServer, stopMongoServer } from "./monogoMemoryServer";
import mongoose from "mongoose";

beforeAll(async () => {
  process.env.JWT_SECRET = "testsecret";
  await startMongoServer();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await stopMongoServer();
});
