import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import EmployerNewJob from './routes/EmployerNewJob';
import JobDetail from './routes/JobDetail';
import ApplyJob from './routes/ApplyJob';
import ProofResult from './routes/ProofResult';
import BrowseJobs from './routes/BrowseJobs';
import EmployerApplications from './routes/EmployerApplications';
import ReviewApplication from './routes/ReviewApplication';
import ApplicantStatus from './routes/ApplicantStatus';
import Privacy from './routes/Privacy';
import AccessibilityBanner from './components/AccessibilityBanner';
import { initializeStore } from './state/jobs.store';

function App() {
  // Initialize store on app mount
  useEffect(() => {
    initializeStore();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <AccessibilityBanner />
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <NavLink to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-xl">🔐</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">ZK Job Board</h1>
              </NavLink>
              
              <div className="flex items-center space-x-8">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-gray-900 font-semibold border-b-2 border-gray-900 pb-1 transition-colors"
                      : "text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  }
                  aria-label="Home"
                  end
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/employer/new" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-gray-900 font-semibold border-b-2 border-gray-900 pb-1 transition-colors"
                      : "text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  }
                  aria-label="Submit Job"
                >
                  Submit Job
                </NavLink>
                <NavLink 
                  to="/jobs" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-gray-900 font-semibold border-b-2 border-gray-900 pb-1 transition-colors"
                      : "text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  }
                  aria-label="Browse Jobs"
                >
                  Browse Jobs
                </NavLink>
                <NavLink 
                  to="/status" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-gray-900 font-semibold border-b-2 border-gray-900 pb-1 transition-colors"
                      : "text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  }
                  aria-label="Check Status"
                >
                  Check Status
                </NavLink>
                <NavLink 
                  to="/privacy" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-gray-900 font-semibold border-b-2 border-gray-900 pb-1 transition-colors"
                      : "text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  }
                  aria-label="Privacy"
                >
                  Privacy
                </NavLink>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<BrowseJobs />} />
            <Route path="/employer/new" element={<EmployerNewJob />} />
            <Route path="/employer/job/:id/applications" element={<EmployerApplications />} />
            <Route path="/employer/application/:applicationId" element={<ReviewApplication />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/job/:id/apply" element={<ApplyJob />} />
            <Route path="/proof-result" element={<ProofResult />} />
            <Route path="/status" element={<ApplicantStatus />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-600">
                © 2025 ZK Job Board - Built for Midnight Network Challenge
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a 
                  href="https://github.com/depapp/zk-job-board" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="GitHub Repository"
                >
                  GitHub
                </a>
                <a 
                  href="/docs" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Documentation"
                >
                  Docs
                </a>
                <span className="text-gray-600">Apache 2.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Home Page Component
function HomePage() {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-6 text-gray-900">
          Anonymous Job Applications
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          A privacy-preserving job application system built on Midnight Network with zero-knowledge proofs
        </p>
        
        <div className="flex justify-center space-x-4">
          <NavLink to="/jobs" className="btn-primary flex items-center space-x-2">
            <span>🔍</span>
            <span>Browse Jobs</span>
          </NavLink>
          <NavLink to="/employer/new" className="btn-secondary flex items-center space-x-2">
            <span>➕</span>
            <span>Post a Job</span>
          </NavLink>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="feature-card">
          <div className="feature-icon">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Complete Anonymity</h3>
          <p className="text-gray-600 text-sm">
            Zero-knowledge proofs ensure your identity remains completely hidden while proving job eligibility
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Rate Limiting</h3>
          <p className="text-gray-600 text-sm">
            Nullifier-based system prevents spam while maintaining privacy - one application per job per member
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">End-to-End Privacy</h3>
          <p className="text-gray-600 text-sm">
            Applications are encrypted client-side and only accessible to authorized employers with proper keys
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-8 text-gray-900">How It Works</h3>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-semibold mb-1">Post a Job</h4>
              <p className="text-gray-600">Employers create job postings with specific requirements for skills, experience, and regions</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-semibold mb-1">Generate Proof</h4>
              <p className="text-gray-600">Applicants generate zero-knowledge proofs of their qualifications without exposing actual credentials</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-semibold mb-1">Submit Application</h4>
              <p className="text-gray-600">The proof is verified and stored, confirming eligibility without revealing personal information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-12 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Experience Privacy-First Hiring?
        </h3>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Join the future of job applications where your skills matter, not your personal data.
        </p>
        <div className="flex justify-center space-x-4">
          <NavLink to="/jobs" className="btn-primary">
            Find Jobs
          </NavLink>
          <NavLink to="/employer/new" className="btn-secondary">
            Post a Job
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default App;
