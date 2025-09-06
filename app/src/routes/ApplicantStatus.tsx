import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useJobsStore } from '../state/jobs.store';
import { ApplicationRecord } from '../lib/types';
import ApplicationStatusBadge from '../components/applications/ApplicationStatusBadge';

const ApplicantStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getApplicationById, getJobById } = useJobsStore();
  
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  const [job, setJob] = useState<any>(null);
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const appId = searchParams.get('appId');
    if (appId) {
      setSearchId(appId);
      checkApplicationStatus(appId);
    }
  }, [searchParams]);

  const checkApplicationStatus = (appId: string) => {
    setError('');
    const app = getApplicationById(appId);
    
    if (!app) {
      setError('Application not found. Please check your Application ID.');
      setApplication(null);
      setJob(null);
      return;
    }

    setApplication(app);
    
    const jobData = getJobById(app.jobId);
    if (jobData) {
      setJob(jobData);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      checkApplicationStatus(searchId.trim());
    }
  };

  const getStatusMessage = () => {
    if (!application) return null;

    switch (application.status) {
      case 'PENDING':
        return {
          icon: '⏳',
          title: 'Application Under Review',
          message: 'Your application is currently being reviewed by the employer. Please check back later for updates.',
          color: 'yellow'
        };
      case 'APPROVED':
        return {
          icon: '🎉',
          title: 'Congratulations! Application Approved',
          message: 'Your application has been approved! The employer will contact you with next steps.',
          color: 'green'
        };
      case 'REJECTED':
        return {
          icon: '😔',
          title: 'Application Not Selected',
          message: 'Unfortunately, your application was not selected for this position. Keep applying to other opportunities!',
          color: 'red'
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Check Application Status
        </h1>
        <p className="text-gray-600">
          Enter your Application ID to check the status of your job application
        </p>
      </div>

      <div className="card mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="appId" className="block text-sm font-medium text-gray-700 mb-2">
              Application ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="appId"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g., 4db762ec-1234-5678-90ab-cdef12345678"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Check Status
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You received this ID when you submitted your application
            </p>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>

      {application && job && statusInfo && (
        <div className="space-y-6">
          <div className={`card border-2 border-${statusInfo.color}-200 bg-${statusInfo.color}-50`}>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{statusInfo.icon}</div>
              <h2 className={`text-2xl font-bold text-${statusInfo.color}-900 mb-2`}>
                {statusInfo.title}
              </h2>
              <p className={`text-${statusInfo.color}-800`}>
                {statusInfo.message}
              </p>
              <div className="mt-6">
                <ApplicationStatusBadge status={application.status} className="text-lg px-4 py-2" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Position:</span>{' '}
                <span className="text-gray-900">{job.title}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Company:</span>{' '}
                <span className="text-gray-900">{job.company}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Application ID:</span>{' '}
                <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {application.id}
                </code>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>{' '}
                <span className="text-gray-900">
                  {new Date(application.createdAt).toLocaleDateString()} at{' '}
                  {new Date(application.createdAt).toLocaleTimeString()}
                </span>
              </div>
              {application.reviewedAt && (
                <div>
                  <span className="font-medium text-gray-700">Reviewed:</span>{' '}
                  <span className="text-gray-900">
                    {new Date(application.reviewedAt).toLocaleDateString()} at{' '}
                    {new Date(application.reviewedAt).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              🔒 Your Privacy is Protected
            </h3>
            <p className="text-sm text-blue-800">
              Throughout the application process, your personal information remained completely anonymous. 
              The employer only received proof that you meet the job requirements, without revealing your 
              actual skills, experience level, or location.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link to="/jobs" className="btn-secondary">
              Browse More Jobs
            </Link>
            <Link to="/" className="btn-primary">
              Go to Home
            </Link>
          </div>
        </div>
      )}

      {!application && !error && (
        <div className="card">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600">
              Enter your Application ID above to check your application status
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantStatus;
