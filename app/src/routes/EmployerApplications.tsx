import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobsStore } from '../state/jobs.store';
import { ApplicationRecord, ApplicationStatus } from '../lib/types';
import ApplicationStatusBadge from '../components/applications/ApplicationStatusBadge';

const EmployerApplications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById, getApplicationsByJob } = useJobsStore();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      navigate('/jobs');
      return;
    }

    const jobData = getJobById(id);
    if (!jobData) {
      navigate('/jobs');
      return;
    }

    setJob(jobData);
    const apps = getApplicationsByJob(id);
    // Sort by date, newest first
    setApplications(apps.sort((a, b) => b.createdAt - a.createdAt));
  }, [id, getJobById, getApplicationsByJob, navigate]);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const pendingCount = applications.filter(a => a.status === ApplicationStatus.PENDING).length;
  const approvedCount = applications.filter(a => a.status === ApplicationStatus.APPROVED).length;
  const rejectedCount = applications.filter(a => a.status === ApplicationStatus.REJECTED).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to={`/jobs/${id}`} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Job Details
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Applications for {job.title}
        </h1>
        <p className="text-gray-600">{job.company}</p>
        
        <div className="flex gap-4 mt-4">
          <div className="text-sm">
            <span className="font-semibold">Total:</span> {applications.length}
          </div>
          <div className="text-sm">
            <span className="font-semibold text-yellow-600">Pending:</span> {pendingCount}
          </div>
          <div className="text-sm">
            <span className="font-semibold text-green-600">Approved:</span> {approvedCount}
          </div>
          <div className="text-sm">
            <span className="font-semibold text-red-600">Rejected:</span> {rejectedCount}
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h2>
            <p className="text-gray-600">
              Applications will appear here once candidates apply to this position.
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nullifier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proof Valid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {app.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {app.applicantNullifier.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()} {new Date(app.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.proofOk ? (
                        <span className="text-green-600">✓ Valid</span>
                      ) : (
                        <span className="text-red-600">✗ Invalid</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/employer/application/${app.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;
