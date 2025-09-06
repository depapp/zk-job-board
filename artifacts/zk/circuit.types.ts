// Auto-generated TypeScript types for job_eligibility circuit
// Generated at: 2025-09-05T11:27:25.681Z

export interface PublicInputs {
  jobId: string;
  policyHash: string;
  nullifier: string;
}

export interface PrivateInputs {
  skillsBitset: boolean[];
  experienceYears: number;
  regionIndex: number;
  secret: string;
  requiredSkillsBitset: boolean[];
  minExperienceYears: number;
  allowedRegionsBitset: boolean[];
}

export interface ProofData {
  proof: {
    a: [string, string];
    b: [[string, string], [string, string]];
    c: [string, string];
  };
  publicInputs: PublicInputs;
}

export interface VerificationKey {
  alpha: { x: string; y: string };
  beta: { x: string; y: string };
  gamma: { x: string; y: string };
  delta: { x: string; y: string };
  ic: Array<{ x: string; y: string }>;
}

export const CIRCUIT_CONSTANTS = {
  N_SKILLS: 32,
  MAX_EXPERIENCE: 40,
  N_REGIONS: 6
} as const;
