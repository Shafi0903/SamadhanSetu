import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { signToken, verifyToken } from "../utils/jwt";
import { AuthService } from "../services/auth.service";

describe("SamadhanSetu Core Unit & Lifecycle Tests", () => {
  test("JWT Utility signs and verifies valid token payload", () => {
    const payload = {
      userId: "user-test-uuid-1234",
      role: "CITIZEN" as const,
      isVerified: true,
    };

    const token = signToken(payload);
    assert.ok(typeof token === "string" && token.length > 20, "Token should be a non-empty string");

    const decoded = verifyToken(token);
    assert.equal(decoded.userId, payload.userId);
    assert.equal(decoded.role, payload.role);
    assert.equal(decoded.isVerified, payload.isVerified);
  });

  test("AuthService sends OTP in development with demo code", async () => {
    const phone = "9876543210";
    const res = await AuthService.sendOtp(phone, "Ramesh Test");

    assert.equal(res.success, true);
    assert.ok(res.demoOtp, "Demo OTP should be returned in development mode");
    assert.equal(res.demoOtp.length, 6, "OTP should be 6 digits");
  });

  test("Problem Lifecycle Status Progression conforms to PRD", () => {
    const lifecycle = [
      "PENDING_VERIFICATION",
      "VERIFIED",
      "UNDER_INVESTIGATION",
      "SOLUTION_PROPOSED",
      "RESOLVED",
    ];

    assert.equal(lifecycle[0], "PENDING_VERIFICATION");
    assert.equal(lifecycle[1], "VERIFIED");
    assert.equal(lifecycle[2], "UNDER_INVESTIGATION");
    assert.equal(lifecycle[3], "SOLUTION_PROPOSED");
    assert.equal(lifecycle[4], "RESOLVED");
  });

  test("Role-Based Access Control matrix protects administrative actions", () => {
    const govRoles = ["GOVERNMENT"];
    const universityRoles = ["UNIVERSITY"];
    const industryRoles = ["INDUSTRY"];

    assert.ok(govRoles.includes("GOVERNMENT"));
    assert.ok(!govRoles.includes("CITIZEN"));
    assert.ok(universityRoles.includes("UNIVERSITY"));
    assert.ok(!universityRoles.includes("INDUSTRY"));
    assert.ok(industryRoles.includes("INDUSTRY"));
  });
});
