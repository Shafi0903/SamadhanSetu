import { Router } from "express";
import { ProblemController } from "../controllers/problem.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// Public Challenge Board
router.get("/", ProblemController.getVerified);

// Citizen submission & tracking
router.post("/", authenticate, ProblemController.create);
router.get("/my", authenticate, ProblemController.getMyProblems);

// Government triage & validation
router.get("/triage", authenticate, authorize(["GOVERNMENT"]), ProblemController.getTriage);
router.patch("/:id/verify", authenticate, authorize(["GOVERNMENT"]), ProblemController.verify);
router.patch("/:id/reject", authenticate, authorize(["GOVERNMENT"]), ProblemController.reject);

// Community interaction & details
router.post("/:id/upvote", authenticate, ProblemController.upvote);
router.get("/:id", ProblemController.getById);

export default router;
