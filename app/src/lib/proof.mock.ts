/**
 * Mock proof generation and verification service
 * Simulates ZK proof flow without actual cryptography
 */

import CryptoJS from 'crypto-js';
import { JobPolicy, ApplicantAttributes, ProofBundle, PublicInputs } from './types';

export class MockProofService {
  /**
   * Generate a stable hash of the job policy
   * Arrays are sorted for deterministic output
   */
  policyHash(policy: JobPolicy): string {
    const normalized = {
      requiredSkills: [...policy.requiredSkills].sort(),
      minExperienceYears: policy.minExperienceYears,
      allowedRegions: [...policy.allowedRegions].sort()
    };
    
    const jsonStr = JSON.stringify(normalized);
    return CryptoJS.SHA256(jsonStr).toString();
  }

  /**
   * Derive a nullifier for a specific job and secret
   * Ensures one application per job per secret
   */
  deriveNullifier(jobId: string, secret: string): string {
    const input = `${jobId}||${secret}`;
    return CryptoJS.SHA256(input).toString();
  }

  /**
   * Mock proof generation
   * In reality, this would use the Compact circuit
   */
  async generate(attrs: ApplicantAttributes, policy: JobPolicy): Promise<ProofBundle> {
    // Simulate proof generation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const publicInputs: PublicInputs = {
      jobId: policy.id,
      policyHash: this.policyHash(policy),
      nullifier: this.deriveNullifier(policy.id, attrs.secret)
    };

    // Mock proof object (would be actual ZK proof bytes)
    const proof = {
      type: 'mock_groth16',
      timestamp: Date.now(),
      // In reality, this would be the actual proof components (a, b, c)
      mockData: CryptoJS.SHA256(JSON.stringify({ attrs, policy, publicInputs })).toString()
    };

    return {
      proof,
      publicInputs
    };
  }

  /**
   * Mock proof verification
   * Checks if applicant meets job requirements
   */
  async verify(
    bundle: ProofBundle, 
    policy: JobPolicy, 
    attrs: ApplicantAttributes
  ): Promise<boolean> {
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verify public inputs match
    if (bundle.publicInputs.jobId !== policy.id) {
      console.error('Job ID mismatch');
      return false;
    }

    if (bundle.publicInputs.policyHash !== this.policyHash(policy)) {
      console.error('Policy hash mismatch');
      return false;
    }

    const expectedNullifier = this.deriveNullifier(policy.id, attrs.secret);
    if (bundle.publicInputs.nullifier !== expectedNullifier) {
      console.error('Nullifier mismatch');
      return false;
    }

    // Check actual requirements (mock verification logic)
    // 1. Check skills subset
    const hasAllRequiredSkills = policy.requiredSkills.every(
      skill => attrs.skills.includes(skill)
    );
    if (!hasAllRequiredSkills) {
      console.error('Missing required skills');
      return false;
    }

    // 2. Check experience
    if (attrs.experienceYears < policy.minExperienceYears) {
      console.error('Insufficient experience');
      return false;
    }

    // 3. Check region
    if (!policy.allowedRegions.includes(attrs.region)) {
      console.error('Region not allowed');
      return false;
    }

    return true;
  }

  /**
   * Simplified verification without attributes (public only)
   * This simulates on-chain verification
   */
  async verifyPublicOnly(bundle: ProofBundle, policy: JobPolicy): Promise<boolean> {
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // In reality, this would verify the ZK proof against the verification key
    // For mock, we just check the public inputs are well-formed
    return (
      bundle.publicInputs.jobId === policy.id &&
      bundle.publicInputs.policyHash === this.policyHash(policy) &&
      bundle.publicInputs.nullifier.length === 64 // SHA256 hex length
    );
  }
}

// Singleton instance
export const proofService = new MockProofService();

// Export convenience functions
export const policyHash = (policy: JobPolicy): string => 
  proofService.policyHash(policy);

export const deriveNullifier = (jobId: string, secret: string): string =>
  proofService.deriveNullifier(jobId, secret);

export const generateProof = (attrs: ApplicantAttributes, policy: JobPolicy): Promise<ProofBundle> =>
  proofService.generate(attrs, policy);

export const verifyLocally = (
  bundle: ProofBundle, 
  policy: JobPolicy, 
  attrs: ApplicantAttributes
): Promise<boolean> =>
  proofService.verify(bundle, policy, attrs);
