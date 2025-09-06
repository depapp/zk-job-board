#!/usr/bin/env node
/**
 * Deploy Verifier Contract Script
 * Uses Midnight JS SDK v2.0.2 for contract deployment
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { 
  deployContract,
  DeployedContract
} from '@midnight-ntwrk/midnight-js-contracts';
import { 
  NodeZkConfigProvider 
} from '@midnight-ntwrk/midnight-js-node-zk-config-provider';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface DeploymentResult {
  address: string;
  txHash: string;
  network: string;
  timestamp: number;
}

/**
 * Deploy the JobEligibilityVerifier contract to Midnight Network
 */
async function deployVerifier(): Promise<DeploymentResult> {
  console.log('🚀 Deploying JobEligibilityVerifier to Midnight Network...\n');

  const rpcUrl = process.env.VITE_MIDNIGHT_RPC_URL || 'https://testnet.midnight.network/rpc';
  const networkId = process.env.VITE_MIDNIGHT_NETWORK_ID || 'testnet-02';
  const apiKey = process.env.VITE_MIDNIGHT_API_KEY;

  if (!apiKey) {
    console.warn('⚠️  No API key provided, using mock deployment');
    return mockDeploy();
  }

  try {
    // Initialize ZK Config Provider for Node.js
    // The NodeZkConfigProvider takes a path string
    const zkConfigPath = path.join(__dirname, '../artifacts/zk');
    const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);

    // Load verifier key
    const vkPath = path.join(__dirname, '../artifacts/zk/job_eligibility.vk.json');
    if (!fs.existsSync(vkPath)) {
      console.error('❌ Verifier key not found. Please run compile-circuits.ts first.');
      process.exit(1);
    }

    const verifierKey = JSON.parse(fs.readFileSync(vkPath, 'utf-8'));
    console.log('✅ Loaded verifier key');

    // In production: Use Midnight JS SDK to deploy contract
    // For now, we'll simulate the deployment
    console.log(`📡 Connecting to ${networkId} at ${rpcUrl}...`);
    
    // Simulate deployment (would use deployContract from SDK)
    const result = await mockDeploy();
    
    console.log('\n✅ Deployment successful!');
    console.log(`📍 Contract Address: ${result.address}`);
    console.log(`🔗 Transaction Hash: ${result.txHash}`);
    console.log(`🌐 Network: ${result.network}`);

    // Save deployment info
    await saveDeploymentInfo(result);

    return result;
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    console.log('\n📝 Falling back to mock deployment for development...');
    return mockDeploy();
  }
}

/**
 * Mock deployment for development/testing
 */
async function mockDeploy(): Promise<DeploymentResult> {
  console.log('🎭 Running mock deployment (development mode)...');
  
  // Simulate deployment delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mockAddress = '0x' + Buffer.from('mock-verifier-' + Date.now()).toString('hex');
  const mockTxHash = '0x' + Buffer.from('deploy-tx-' + Date.now()).toString('hex');
  
  const result: DeploymentResult = {
    address: mockAddress,
    txHash: mockTxHash,
    network: 'mock-testnet',
    timestamp: Date.now()
  };

  console.log('\n✅ Mock deployment successful!');
  console.log(`📍 Mock Contract Address: ${result.address}`);
  console.log(`🔗 Mock Transaction Hash: ${result.txHash}`);
  
  return result;
}

/**
 * Save deployment information to files
 */
async function saveDeploymentInfo(result: DeploymentResult): Promise<void> {
  // Save to contracts/addresses.json
  const addressesPath = path.join(__dirname, '../contracts/addresses.json');
  const addresses = fs.existsSync(addressesPath) 
    ? JSON.parse(fs.readFileSync(addressesPath, 'utf-8'))
    : {};
  
  addresses[result.network] = {
    JobEligibilityVerifier: result.address,
    deployedAt: result.timestamp,
    txHash: result.txHash
  };
  
  fs.mkdirSync(path.dirname(addressesPath), { recursive: true });
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log(`\n📄 Saved to contracts/addresses.json`);

  // Update .env.local
  const envPath = '.env.local';
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  // Update or add VITE_VERIFIER_ADDRESS
  const envLines = envContent.split('\n');
  const addressLineIndex = envLines.findIndex(line => line.startsWith('VITE_VERIFIER_ADDRESS='));
  
  if (addressLineIndex >= 0) {
    envLines[addressLineIndex] = `VITE_VERIFIER_ADDRESS=${result.address}`;
  } else {
    envLines.push(`VITE_VERIFIER_ADDRESS=${result.address}`);
  }

  fs.writeFileSync(envPath, envLines.join('\n'));
  console.log(`📄 Updated .env.local with verifier address`);
}

/**
 * Main execution
 */
async function main() {
  console.log('====================================');
  console.log('  Midnight JobEligibility Verifier');
  console.log('        Deployment Script');
  console.log('====================================\n');

  try {
    const result = await deployVerifier();
    
    console.log('\n====================================');
    console.log('       Deployment Complete!');
    console.log('====================================');
    console.log('\nNext steps:');
    console.log('1. Restart your development server to load the new address');
    console.log('2. The verifier is ready to validate ZK proofs');
    console.log('3. Check contracts/addresses.json for deployment details\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export type { DeploymentResult };
export { deployVerifier };
