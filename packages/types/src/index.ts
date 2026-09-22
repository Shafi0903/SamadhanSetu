/**
 * SamadhanSetu Shared Types and Domain Models
 */

export type UserRole = "CITIZEN" | "GOVERNMENT" | "UNIVERSITY" | "INDUSTRY";

export type ProblemStatus =
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "UNDER_INVESTIGATION"
  | "SOLUTION_PROPOSED"
  | "RESOLVED"
  | "REJECTED";

export type ProblemCategory =
  | "WATER"
  | "ROADS_INFRASTRUCTURE"
  | "WASTE_MANAGEMENT"
  | "ELECTRICITY_ENERGY"
  | "HEALTH_SANITATION"
  | "ENVIRONMENT"
  | "EDUCATION"
  | "OTHER";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  organizationName?: string;
  designation?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  status: ProblemStatus;
  location: GeoLocation;
  mediaUrls: string[];
  reporterId: string;
  upvotesCount: number;
  claimedByUniversityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SolutionProposal {
  id: string;
  problemId: string;
  universityId: string;
  teamLeadId: string;
  title: string;
  description: string;
  documentUrls: string[];
  repoUrl?: string;
  stage: "PROPOSED" | "PROTOTYPE" | "TESTING" | "DEPLOYED";
  createdAt: string;
  updatedAt: string;
}

export interface SupportPledge {
  id: string;
  solutionId: string;
  industryPartnerId: string;
  pledgeType: "MENTORSHIP" | "EQUIPMENT" | "CSR_FUNDING" | "INCUBATION";
  description: string;
  amount?: number;
  status: "PENDING" | "ACCEPTED" | "FULFILLED";
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
