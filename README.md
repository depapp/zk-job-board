# ZK Job Board - Midnight Network Challenge Submission

A privacy-preserving job board where applicants prove they meet job requirements without revealing their personal attributes, built using Midnight Network's Compact language and MidnightJS.

## Full Explanation on DEV.to Article
- https://dev.to/depapp/privacy-first-job-applications-with-midnight-network-ing 

## 🎯 Overview

The ZK Job Board enables:
- **Employers** to post jobs with specific requirements (skills, experience, region)
- **Applicants** to prove they meet requirements without revealing their actual credentials
- **Privacy-first** interactions using zero-knowledge proofs
- **Anti-spam** protection via nullifiers (prevents double applications)

### Key Features

- ✅ **Zero-Knowledge Proofs**: Applicants prove eligibility without exposing personal data
- 🔒 **Privacy by Design**: Only proof validity is revealed, not underlying attributes
- 🎨 **Accessible UI**: WCAG-compliant interface with clear privacy indicators
- 🚀 **Midnight Integration**: Uses Compact circuits and MidnightJS for ZK functionality
- 📝 **Apache 2.0 Licensed**: Fully open-source

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/depapp/zk-job-board.git
cd zk-job-board

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Midnight testnet configuration

# Compile ZK circuits
npm run compile-circuits

# Deploy verifier contract (testnet)
npm run deploy-verifier

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Employer  │────▶│  Job Policy  │────▶│  On-Chain   │
│     UI      │     │   Creation   │     │   Storage   │
└─────────────┘     └──────────────┘     └─────────────┘
                                                 │
                                                 ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Applicant  │────▶│ ZK Proof Gen │────▶│  Verifier   │
│     UI      │     │  (Midnight)  │     │  Contract   │
└─────────────┘     └──────────────┘     └─────────────┘
```

### Components

1. **Compact Circuits** (`circuits/`): Define the ZK logic for attribute verification
2. **Smart Contracts** (`contracts/`): On-chain verifier for proof validation
3. **React UI** (`app/`): User interface for employers and applicants
4. **MidnightJS Integration** (`app/lib/midnight.ts`): Proof generation and verification

## 📋 How It Works

### For Employers
1. Create a job posting with requirements:
   - Required skills (e.g., TypeScript, React, ZK)
   - Minimum experience level
   - Allowed regions
2. Job policy is hashed and stored on-chain
3. Applicants can view requirements and apply

### For Applicants
1. Generate mock credentials (skills, experience, region)
2. Create a ZK proof that you meet job requirements
3. Submit proof without revealing actual attributes
4. System verifies proof and prevents double applications

### Privacy Guarantees
- ✅ Skills are proven as a subset match without revealing all skills
- ✅ Experience is proven as >= minimum without revealing exact years
- ✅ Region membership is proven without revealing specific location
- ✅ Nullifiers prevent double applications while maintaining unlinkability across jobs

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Test circuit constraints
npm run test:circuits
```

## 📁 Project Structure

```
zk-job-board/
├── circuits/              # Compact ZK circuits
│   ├── job_eligibility.cmp
│   └── params.toml
├── contracts/             # Smart contracts
│   └── JobEligibilityVerifier.ts
├── app/                   # React application
│   ├── src/
│   │   ├── routes/       # Page components
│   │   ├── components/   # Reusable UI components
│   │   ├── lib/          # Core logic & Midnight integration
│   │   └── state/        # State management
│   └── index.html
├── scripts/              # Build and deployment scripts
├── tests/                # Test suites
├── docs/                 # Documentation
└── config/               # Configuration files
```

## 🔐 Security & Privacy

- All credentials are **mocked** - no real personal data is used
- Proofs are generated client-side - sensitive data never leaves your device
- Nullifiers prevent replay attacks while maintaining privacy
- Open-source for full transparency

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
