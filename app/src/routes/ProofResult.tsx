import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

interface LocationState {
  success: boolean;
  jobTitle?: string;
  company?: string;
  applicationId?: string;
  error?: string;
}

const ProofResult: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Default state if accessed directly
  if (!state) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No application result to display</p>
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        {state.success ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Application Submitted Successfully!
            </h2>
            
            <div className="mb-6">
              <p className="text-xl text-gray-700 mb-2">
                Your application to <strong>{state.jobTitle}</strong>
              </p>
              <p className="text-lg text-gray-600">
                at {state.company} has been submitted
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="font-semibold text-green-900 mb-3">
                🔒 Your Privacy Was Protected
              </h3>
              <ul className="text-sm text-green-800 space-y-2 text-left">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Your exact skills remained hidden - only proof of required skills was shared</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Your precise experience was not revealed - only proof of meeting minimum</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Your specific location stayed private - only proof of allowed region</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Your identity remains completely anonymous</span>
                </li>
              </ul>
            </div>

            {state.applicationId && (
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-2">Application ID:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="font-mono text-xs bg-gray-100 px-3 py-2 rounded break-all max-w-md">
                    {state.applicationId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(state.applicationId!)}
                    className="px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors text-sm"
                    title="Copy to clipboard"
                  >
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/status?appId=${state.applicationId}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Check Application Status →
                  </Link>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Link to="/jobs" className="btn-secondary">
                Browse More Jobs
              </Link>
              <Link to="/" className="btn-primary">
                Go to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Application Not Submitted
            </h2>
            
            <div className="mb-6">
              <p className="text-xl text-gray-700 mb-2">
                Your application to <strong>{state.jobTitle}</strong>
              </p>
              <p className="text-lg text-gray-600 mb-4">
                at {state.company} could not be submitted
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="font-semibold text-red-900 mb-2">
                Reason
              </h3>
              <p className="text-red-800">
                {state.error || 'You do not meet the job requirements'}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-2">
                💡 What to do next?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Review the job requirements carefully</li>
                <li>• Ensure you have all the required skills</li>
                <li>• Check that you meet the minimum experience</li>
                <li>• Verify you're in an allowed region</li>
                <li>• Try applying to other matching positions</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Link to="/jobs" className="btn-secondary">
                Browse Other Jobs
              </Link>
              <button 
                onClick={() => window.history.back()} 
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProofResult;
