import React from 'react';
import { JobForm } from '../components/forms/JobForm';

const EmployerNewJob: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Post a New Job</h2>
        <p className="text-gray-600">
          Create a job posting with privacy-preserving requirements. 
          Applicants will prove they meet your criteria without revealing personal information.
        </p>
      </div>
      
      <div className="card">
        <JobForm />
      </div>
    </div>
  );
};

export default EmployerNewJob;
