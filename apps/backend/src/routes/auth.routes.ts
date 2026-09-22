import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { authRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

// Public routes (Rate-limited against brute-force & credential stuffing)
router.post("/otp/send", authRateLimiter, AuthController.sendOtp);
router.post("/otp/verify", authRateLimiter, AuthController.verifyOtp);
router.post("/register", authRateLimiter, AuthController.registerInstitution);
router.post("/login", authRateLimiter, AuthController.login);

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
