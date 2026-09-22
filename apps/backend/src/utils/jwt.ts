import jwt from "jsonwebtoken";
import { UserRole } from "@samadhansetu/types";

export interface JwtPayload {
  userId: string;
  role: UserRole;
  isVerified: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || "samadhansetu_default_secret_key_change_in_production";
const JWT_EXPIRES_IN = "7d";

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
