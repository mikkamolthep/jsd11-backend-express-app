import { Router } from "express";
import { router as usersRoutes } from "./users.routes.js";
import healthRoutes from "./health.routes.js"

export const router = Router();

router.use("/users", usersRoutes);

router.use("/health", healthRoutes)
