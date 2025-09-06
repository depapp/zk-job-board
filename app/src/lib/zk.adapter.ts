/**
 * ZK Adapter - Routes between MidnightJS and Mock implementations
 * Allows seamless switching between real Midnight Network integration and local mock
 */

import { JobPolicy, ApplicantAttributes, ProofBundle } from './types';
import * as mockService from './proof.mock';
import * as midnightService from './midnight';

// Check if Midnight integration is enabled
const MIDNIGHT_ENABLED = import.meta.env.VITE_MIDNIGHT_ENABLED === 'true';

// Log the current mode
console.log(`[ZK Adapter] Running in ${MIDNIGHT_ENABLED ? 'MIDNIGHT' : 'MOCK'} mode`);

/**
 * Generate a ZK proof for job application
 * Routes to either Midnight SDK or mock implementation
 */
export async function generateProof(
  attrs: ApplicantAttributes,
  policy: JobPolicy
): Promise<ProofBundle> {
  if (MIDNIGHT_ENABLED) {
    console.log('[ZK Adapter] Using Midnight Network for proof generation');
    try {
      return await midnightService.generateProofMidnight(attrs, policy);
    } catch (error) {
      console.error('[ZK Adapter] Midnight proof generation failed, falling back to mock:', error);
      // Fallback to mock if Midnight fails
      return await mockService.generateProof(attrs, policy);
    }
  } else {
    console.log('[ZK Adapter] Using mock proof generation');
    return await mockService.generateProof(attrs, policy);
  }
}

/**
 * Verify a proof
 * Routes to either on-chain verification or local mock
 */
export async function verifyProof(
  bundle: ProofBundle,
  policy: JobPolicy,
  attrs?: ApplicantAttributes
): Promise<boolean> {
  if (MIDNIGHT_ENABLED) {
    console.log('[ZK Adapter] Using on-chain verification');
    try {
      return await midnightService.verifyOnChain(bundle);
    } catch (error) {
      console.error('[ZK Adapter] On-chain verification failed:', error);
      // If on-chain fails and we have attributes, try local verification
      if (attrs) {
        return await mockService.verifyLocally(bundle, policy, attrs);
      }
      return false;
    }
  } else {
    console.log('[ZK Adapter] Using mock verification');
    // For mock mode, we need attributes for verification
    if (!attrs) {
      console.warn('[ZK Adapter] Mock verification requires attributes');
      // In mock mode without attrs, just check the proof structure
      return await mockService.proofService.verifyPublicOnly(bundle, policy);
    }
    return await mockService.verifyLocally(bundle, policy, attrs);
  }
}

/**
 * Submit application with proof
 * Routes to either on-chain submission or local storage
 */
export async function submitApplication(
  jobId: string,
  bundle: ProofBundle,
  policy: JobPolicy
): Promise<{ success: boolean; txHash?: string; applicationId?: string }> {
  if (MIDNIGHT_ENABLED) {
    console.log('[ZK Adapter] Submitting application on-chain');
    try {
      const result = await midnightService.submitApplicationOnChain(jobId, bundle);
      return {
        success: result.success,
        txHash: result.txHash,
        applicationId: bundle.publicInputs.nullifier.substring(0, 16) // Use part of nullifier as ID
      };
    } catch (error) {
      console.error('[ZK Adapter] On-chain submission failed:', error);
      throw error;
    }
  } else {
    console.log('[ZK Adapter] Storing application locally');
    // For mock mode, just verify and return success
    const isValid = await mockService.proofService.verifyPublicOnly(bundle, policy);
    
    if (!isValid) {
      throw new Error('Proof verification failed');
    }
    
    // Check for duplicate nullifier in local storage
    const usedNullifiers = JSON.parse(localStorage.getItem('mock:nullifiers') || '[]');
    if (usedNullifiers.includes(bundle.publicInputs.nullifier)) {
      throw new Error('Application already submitted for this job');
    }
    
    // Mark nullifier as used
    usedNullifiers.push(bundle.publicInputs.nullifier);
    localStorage.setItem('mock:nullifiers', JSON.stringify(usedNullifiers));
    
    return {
      success: true,
      txHash: undefined, // No transaction in mock mode
      applicationId: bundle.publicInputs.nullifier.substring(0, 16)
    };
  }
}

/**
 * Get the current adapter mode
 */
export function getAdapterMode(): 'MIDNIGHT' | 'MOCK' {
  return MIDNIGHT_ENABLED ? 'MIDNIGHT' : 'MOCK';
}

/**
 * Check if Midnight integration is available
 */
export function isMidnightAvailable(): boolean {
  return MIDNIGHT_ENABLED && !!import.meta.env.VITE_VERIFIER_ADDRESS;
}

/**
 * Get configuration status
 */
export function getConfigStatus(): {
  mode: 'MIDNIGHT' | 'MOCK';
  midnightEnabled: boolean;
  verifierAddress?: string;
  rpcUrl?: string;
  network?: string;
} {
  return {
    mode: getAdapterMode(),
    midnightEnabled: MIDNIGHT_ENABLED,
    verifierAddress: import.meta.env.VITE_VERIFIER_ADDRESS,
    rpcUrl: import.meta.env.VITE_MIDNIGHT_RPC_URL,
    network: import.meta.env.VITE_MIDNIGHT_NETWORK
  };
}

// Re-export utility functions that don't need routing
export { policyHash, deriveNullifier } from './proof.mock';
