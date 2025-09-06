/**
 * Validation schemas using Zod
 */

import { z } from 'zod';
import { RegionCode } from './types';
import allowedSkills from '../../../config/allowlist.skills.json';

// Load allowed skills from config
const ALLOWED_SKILLS = new Set(allowedSkills.skills);

// Region validation
const regionCodeSchema = z.nativeEnum(RegionCode);

// Skill validation
const skillTagSchema = z.string().refine(
  (skill) => ALLOWED_SKILLS.has(skill),
  { message: 'Skill not in allowlist' }
);

// Job Policy validation
export const jobPolicySchema = z.object({
  title: z.string().min(3).max(80),
  company: z.string().min(2).max(60),
  requiredSkills: z.array(skillTagSchema).min(1).max(5),
  minExperienceYears: z.number().int().min(0).max(40),
  allowedRegions: z.array(regionCodeSchema).min(1).max(5)
});

// Applicant Attributes validation
export const applicantAttributesSchema = z.object({
  skills: z.array(skillTagSchema).min(1).max(10),
  experienceYears: z.number().int().min(0).max(40),
  region: regionCodeSchema,
  secret: z.string().regex(/^[0-9a-f]{64}$/i, 'Secret must be 64 hex characters')
});

// Form input schemas (without id/createdAt)
export type JobPolicyInput = z.infer<typeof jobPolicySchema>;
export type ApplicantAttributesInput = z.infer<typeof applicantAttributesSchema>;

// Helper to generate random secret
export function generateSecret(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Export the allowed skills for UI
export const getAllowedSkills = (): string[] => Array.from(ALLOWED_SKILLS);

// Export regions for UI
export const getAllowedRegions = (): RegionCode[] => Object.values(RegionCode);
