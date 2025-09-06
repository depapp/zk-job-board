import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobsStore } from '../state/jobs.store';
import { JobListing } from '../lib/types';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getJobById = useJobsStore(state => state.getJobById);
  const applications = useJobsStore(state => state.applications);
  const [job, setJob] = useState<JobListing | undefined>();

  useEffect(() => {
    if (id) {
      const foundJob = getJobById(id);
      if (foundJob) {
        setJob(foundJob);
      } else {
        // Job not found, redirect to browse
        navigate('/jobs');
      }
    }
  }, [id, getJobById, navigate]);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  const applicationCount = applications.filter(app => app.jobId === job.id).length;
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/jobs" className="text-gray-600 hover:text-gray-900 mb-4 inline-block">
          ← Back to Jobs
        </Link>
        
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{job.title}</h1>
        <p className="text-xl text-gray-600">{job.company}</p>
        
        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
          <span>Posted on {formatDate(job.createdAt)}</span>
          <span>•</span>
          <span>{applicationCount} application{applicationCount !== 1 ? 's' : ''} received</span>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Job Requirements</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map(skill => (
                <span key={skill} className="badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Minimum Experience</h3>
            <p className="text-gray-600">{job.minExperienceYears} years</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Allowed Regions</h3>
            <div className="flex flex-wrap gap-2">
              {job.allowedRegions.map(region => (
                <span key={region} className="badge badge-info">
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Privacy Information</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">🔒 Zero-Knowledge Application Process</h3>
          <p className="text-sm text-green-800 mb-3">
            When you apply to this job, your personal information remains completely private:
          </p>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Your exact skills are not revealed - only proof you have the required ones</li>
            <li>• Your precise experience is hidden - only proof you meet the minimum</li>
            <li>• Your specific location stays private - only proof you're in an allowed region</li>
            <li>• Your identity remains anonymous throughout the process</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link to="/jobs" className="btn-secondary">
          Browse More Jobs
        </Link>
        <div className="flex gap-3">
          <Link to={`/job/${job.id}/apply`} className="btn-primary">
            Apply with ZK Proof →
          </Link>
          <Link to={`/employer/job/${job.id}/applications`} className="btn-secondary">
            View Applications (Employer)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
