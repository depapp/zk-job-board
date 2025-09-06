import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy & Security</h1>
        <p className="text-xl text-gray-600">
          Your privacy is our foundation. Learn how we protect your data with zero-knowledge technology.
        </p>
      </div>

      {/* Zero-Knowledge Guarantee */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔐 Zero-Knowledge Guarantee</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Our platform uses advanced zero-knowledge proof technology powered by Midnight Network to ensure 
            your personal information remains completely private throughout the job application process.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">What We Never See:</h3>
            <ul className="space-y-2 text-green-800">
              <li>✓ Your actual skills - only proof you have the required ones</li>
              <li>✓ Your exact experience level - only proof you meet minimums</li>
              <li>✓ Your specific location - only proof you're in allowed regions</li>
              <li>✓ Your identity or any personally identifiable information</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">🛡️ How Privacy Protection Works</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Local Proof Generation</h3>
            <p className="text-gray-700">
              When you apply for a job, all computations happen locally in your browser. Your actual 
              credentials never leave your device - only a mathematical proof of eligibility is created.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Anonymous Submission</h3>
            <p className="text-gray-700">
              The proof is submitted with a unique nullifier that prevents duplicate applications while 
              maintaining complete anonymity. Employers cannot link applications to individuals.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Verification Without Revelation</h3>
            <p className="text-gray-700">
              Employers can verify that you meet all job requirements without seeing any of your actual 
              attributes. They only receive a binary "qualified" or "not qualified" result.
            </p>
          </div>
        </div>
      </div>

      {/* Data Handling */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">📊 Data Handling Practices</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">What We Store:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Job posting details (public)</li>
                <li>• Proof verification results</li>
                <li>• Application nullifiers (anonymous)</li>
                <li>• Timestamps and status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">What We Don't Store:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Personal information</li>
                <li>• Actual skills or experience</li>
                <li>• Location data</li>
                <li>• Contact information</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> This is a demonstration application. In production, all data would be 
              stored on the Midnight Network blockchain with additional encryption layers.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">⚙️ Technical Implementation</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Our privacy-preserving job board leverages several key technologies:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>Midnight Network:</strong> Provides the zero-knowledge proof infrastructure and 
              smart contract platform for secure, private transactions.
            </li>
            <li>
              <strong>Compact Language:</strong> Used to define the zero-knowledge circuits that verify 
              job eligibility without revealing personal data.
            </li>
            <li>
              <strong>Nullifier System:</strong> Prevents duplicate applications while maintaining 
              anonymity through cryptographic commitments.
            </li>
            <li>
              <strong>Client-Side Encryption:</strong> All sensitive operations occur in your browser, 
              ensuring data privacy from end to end.
            </li>
          </ul>
        </div>
      </div>

      {/* Accessibility & Privacy */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">♿ Accessibility Features</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Privacy and accessibility go hand in hand. Our platform ensures everyone can use our 
            privacy-preserving features:
          </p>
          <ul className="space-y-2">
            <li>• Full keyboard navigation support</li>
            <li>• Screen reader compatibility with ARIA labels</li>
            <li>• High contrast mode for visual accessibility</li>
            <li>• Adjustable font sizes</li>
            <li>• Clear focus indicators</li>
            <li>• Reduced motion options</li>
          </ul>
          <p className="mt-4">
            Access these features anytime using the accessibility button in the bottom-right corner.
          </p>
        </div>
      </div>

      {/* Open Source */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">🌐 Open Source & Transparency</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            This project is fully open source under the Apache 2.0 license. You can review our code, 
            verify our privacy claims, and contribute to making privacy-preserving hiring accessible to all.
          </p>
          <div className="flex gap-4 mt-4">
            <a 
              href="https://github.com/depapp/zk-job-board" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <span>📦</span>
              <span>View on GitHub</span>
            </a>
            <a 
              href="https://midnight.network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <span>🌙</span>
              <span>Learn About Midnight</span>
            </a>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">📧 Questions or Concerns?</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            If you have any questions about our privacy practices or how the zero-knowledge system works, 
            please don't hesitate to reach out through our GitHub repository or explore our documentation.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Remember:</strong> This is a demonstration application for the Midnight Network 
              Challenge. In a production environment, additional privacy measures and legal compliance 
              would be implemented.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Privacy;
