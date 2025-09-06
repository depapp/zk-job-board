/**
 * Core type definitions for the ZK Job Board
 */

export enum RegionCode {
  NA = 'NA',
  EU = 'EU',
  APAC = 'APAC',
  LATAM = 'LATAM',
  AFRICA = 'AFRICA',
  MENA = 'MENA'
}

export type SkillTag = string;

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface JobPolicy {
  id: string;                      // UUID (jobId), also public input for proofs
  title: string;
  company: string;
  requiredSkills: SkillTag[];      // 1–5 items, subset of allowlist
  minExperienceYears: number;      // 0–40
  allowedRegions: RegionCode[];    // 1–5 items
  createdAt: number;                // epoch ms
}

export interface JobListing extends JobPolicy {}

export interface ApplicantAttributes {
  skills: SkillTag[];               // 1–10 subset of allowlist
  experienceYears: number;          // 0–40
  region: RegionCode;
  secret: string;                   // 32-byte hex string (mock)
}

export interface PublicInputs {
  jobId: string;
  policyHash: string;
  nullifier: string;
}

export interface ProofBundle {
  proof: unknown;                   // opaque in mock
  publicInputs: PublicInputs;
}

export interface ApplicationRecord {
  id: string;                       // UUID
  jobId: string;
  applicantNullifier: string;
  proofOk: boolean;
  createdAt: number;
  status: ApplicationStatus;        // Application status
  reviewedAt?: number;              // When reviewed (epoch ms)
  reviewerNote?: string;            // Optional note from reviewer
}

export interface ReviewDecisionInput {
  applicationId: string;
  status: Exclude<ApplicationStatus, 'PENDING'>;
  note?: string;
}
