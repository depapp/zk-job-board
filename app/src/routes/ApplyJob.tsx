import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobsStore } from '../state/jobs.store';
import { JobListing } from '../lib/types';
import { ApplicationForm } from '../components/forms/ApplicationForm';
import { ApplicantAttributesInput } from '../lib/validation';
import { generateProof, verifyProof } from '../lib/zk.adapter';

const ApplyJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getJobById = useJobsStore(state => state.getJobById);
  const addApplication = useJobsStore(state => state.addApplication);
  const checkIfApplied = useJobsStore(state => state.checkIfApplied);
  
  const [job, setJob] = useState<JobListing | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (attributes: ApplicantAttributesInput) => {
    if (!job) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Generate ZK proof (using adapter - routes to Midnight or mock)
      console.log('Generating zero-knowledge proof...');
      const proofBundle = await generateProof(attributes, job);
      
      // Check if already applied (using nullifier)
      if (checkIfApplied(job.id, proofBundle.publicInputs.nullifier)) {
        throw new Error('You have already applied to this job with these credentials');
      }
      
      // Step 2: Verify proof (using adapter - routes to on-chain or local)
      console.log('Verifying proof...');
      const isValid = await verifyProof(proofBundle, job, attributes);
      
      if (!isValid) {
        throw new Error('You do not meet the job requirements');
      }
      
      // Step 3: Submit application
      console.log('Submitting application...');
      const application = await addApplication({
        jobId: job.id,
        applicantNullifier: proofBundle.publicInputs.nullifier,
        proofOk: true
      });
      
      // Navigate to success page with application data
      navigate('/proof-result', { 
        state: { 
          success: true, 
          jobTitle: job.title,
          company: job.company,
          applicationId: application.id 
        } 
      });
    } catch (err: any) {
      console.error('Application failed:', err);
      setError(err.message || 'Failed to submit application');
      setIsProcessing(false);
      
      // If it's a requirements error, navigate to result page with failure
      if (err.message?.includes('do not meet')) {
        navigate('/proof-result', { 
          state: { 
            success: false, 
            jobTitle: job.title,
            company: job.company,
            error: err.message 
          } 
        });
      }
    }
  };

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Apply to {job.title}</h2>
        <p className="text-xl text-gray-600">{job.company}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isProcessing ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Generating Zero-Knowledge Proof</h3>
            <p className="text-gray-600">
              Your credentials are being processed privately...
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <ApplicationForm job={job} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};

export default ApplyJob;
