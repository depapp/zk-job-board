import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJobsStore } from '../state/jobs.store';
import { ApplicationRecord, ApplicationStatus } from '../lib/types';
import ApplicationStatusBadge from '../components/applications/ApplicationStatusBadge';

const ReviewApplication: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { getApplicationById, getJobById, updateApplicationStatus } = useJobsStore();
  
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  const [job, setJob] = useState<any>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!applicationId) {
      navigate('/jobs');
      return;
    }

    const app = getApplicationById(applicationId);
    if (!app) {
      navigate('/jobs');
      return;
    }

    setApplication(app);
    setReviewNote(app.reviewerNote || '');

    const jobData = getJobById(app.jobId);
    if (jobData) {
      setJob(jobData);
    }
  }, [applicationId, getApplicationById, getJobById, navigate]);

  const handleDecision = async (status: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED) => {
    if (!application) return;

    setIsSubmitting(true);
    setError('');

    try {
      await updateApplicationStatus({
        applicationId: application.id,
        status,
        note: reviewNote.trim() || undefined
      });

      // Navigate back to applications list
      navigate(`/employer/job/${application.jobId}/applications`);
    } catch (err: any) {
      setError(err.message || 'Failed to update application status');
      setIsSubmitting(false);
    }
  };

  if (!application || !job) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const isAlreadyReviewed = application.status !== ApplicationStatus.PENDING;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to={`/employer/job/${application.jobId}/applications`} 
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Applications
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Review Application
        </h1>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium text-gray-700">Position:</span>{' '}
            <span className="text-gray-900">{job.title}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Company:</span>{' '}
            <span className="text-gray-900">{job.company}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Required Skills:</span>{' '}
            <span className="text-gray-900">{job.requiredSkills.join(', ')}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Min Experience:</span>{' '}
            <span className="text-gray-900">{job.minExperienceYears} years</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Allowed Regions:</span>{' '}
            <span className="text-gray-900">{job.allowedRegions.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-700">Application ID:</span>{' '}
            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {application.id}
            </code>
          </div>
          <div>
            <span className="font-medium text-gray-700">Applicant Nullifier:</span>{' '}
            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded break-all">
              {application.applicantNullifier}
            </code>
          </div>
          <div>
            <span className="font-medium text-gray-700">Submitted:</span>{' '}
            <span className="text-gray-900">
              {new Date(application.createdAt).toLocaleDateString()} at{' '}
              {new Date(application.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Proof Verification:</span>{' '}
            {application.proofOk ? (
              <span className="text-green-600 font-medium">✓ Valid - Meets all requirements</span>
            ) : (
              <span className="text-red-600 font-medium">✗ Invalid - Does not meet requirements</span>
            )}
          </div>
          <div>
            <span className="font-medium text-gray-700">Current Status:</span>{' '}
            <ApplicationStatusBadge status={application.status} />
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

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Decision</h2>
        
        {isAlreadyReviewed ? (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">
                This application has already been reviewed and marked as{' '}
                <strong>{application.status}</strong>.
              </p>
            </div>
            {application.reviewerNote && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Note
                </label>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-gray-700">{application.reviewerNote}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Review Note (Optional)
              </label>
              <textarea
                id="note"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any notes about this application (max 500 characters)..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                maxLength={500}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {reviewNote.length}/500 characters
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>⚠️ Important:</strong> This decision cannot be changed once submitted. 
                The applicant will be able to check their status but will not see your review note.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleDecision(ApplicationStatus.APPROVED)}
                disabled={isSubmitting || !application.proofOk}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
                  application.proofOk
                    ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Processing...' : '✅ Approve Application'}
              </button>
              <button
                onClick={() => handleDecision(ApplicationStatus.REJECTED)}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 font-medium transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? 'Processing...' : '❌ Reject Application'}
              </button>
            </div>

            {!application.proofOk && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Note: Applications with invalid proofs cannot be approved
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewApplication;
