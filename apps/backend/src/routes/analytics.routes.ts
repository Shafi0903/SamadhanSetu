import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/global", AnalyticsController.getGlobal);

export default router;
