import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// Public routes
router.post("/otp/send", AuthController.sendOtp);
router.post("/otp/verify", AuthController.verifyOtp);
router.post("/register", AuthController.registerInstitution);
router.post("/login", AuthController.login);

// Protected routes
router.get("/me", authenticate, AuthController.getMe);

// Nodal / Government Admin routes
router.get(
  "/pending-institutions",
  authenticate,
  authorize(["GOVERNMENT"]),
  AuthController.getPendingInstitutions
);

router.patch(
  "/approve-institution/:id",
  authenticate,
  authorize(["GOVERNMENT"]),
  AuthController.approveInstitution
);

export default router;
