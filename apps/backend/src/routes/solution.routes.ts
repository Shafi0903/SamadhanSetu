import { Router } from "express";
import { SolutionController } from "../controllers/solution.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// University Actions
router.patch(
  "/claim/:id",
  authenticate,
  authorize(["UNIVERSITY"]),
  SolutionController.claim
);

router.post(
  "/",
  authenticate,
  authorize(["UNIVERSITY"]),
  SolutionController.createProposal
);

router.get(
  "/university/my",
  authenticate,
  authorize(["UNIVERSITY"]),
  SolutionController.getUniversityWorkspace
);

// Industry Actions
router.get(
  "/industry/catalog",
  SolutionController.getIndustryCatalog
);

router.post(
  "/pledge",
  authenticate,
  authorize(["INDUSTRY"]),
  SolutionController.pledgeSupport
);

router.get(
  "/industry/my-pledges",
  authenticate,
  authorize(["INDUSTRY"]),
  SolutionController.getMyPledges
);

// Resolution Actions (Gov or University Lead)
router.patch(
  "/resolve/:id",
  authenticate,
  authorize(["GOVERNMENT", "UNIVERSITY"]),
  SolutionController.resolve
);

export default router;
