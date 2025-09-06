/**
 * Browse Jobs page with filtering
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJobsStore } from '../state/jobs.store';
import { RegionCode } from '../lib/types';
import { getAllowedRegions } from '../lib/validation';

const BrowseJobs: React.FC = () => {
  const jobs = useJobsStore(state => state.jobs);
  const applications = useJobsStore(state => state.applications);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | ''>('');

  // Filter jobs based on search and region
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter (title, company, or skills)
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requiredSkills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Region filter
      const matchesRegion = !selectedRegion || 
        job.allowedRegions.includes(selectedRegion as RegionCode);

      return matchesSearch && matchesRegion;
    });
  }, [jobs, searchTerm, selectedRegion]);

  // Get application count for each job
  const getApplicationCount = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId).length;
  };

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Browse Jobs</h1>
        <p className="text-gray-600">
          Find opportunities that match your skills and apply with privacy-preserving proofs
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title, company, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as RegionCode | '')}
              className="form-input w-full"
            >
              <option value="">All Regions</option>
              {getAllowedRegions().map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
      </div>

      {/* Job listings */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No jobs found matching your criteria</p>
          <Link to="/employer/new" className="btn-primary">
            Post the First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <Link
              key={job.id}
              to={`/job/${job.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-500">{formatTimeAgo(job.createdAt)}</p>
                      <p className="text-gray-600 mt-1">
                        {getApplicationCount(job.id)} application{getApplicationCount(job.id) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.requiredSkills.map(skill => (
                      <span key={skill} className="badge">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Min. {job.minExperienceYears} years</span>
                    <span>•</span>
                    <span>{job.allowedRegions.join(', ')}</span>
                  </div>
                </div>

                <div className="ml-6 flex-shrink-0">
                  <span className="btn-primary text-sm">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state for no jobs at all */}
      {jobs.length === 0 && !searchTerm && !selectedRegion && (
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Jobs Posted Yet
          </h2>
          <p className="text-gray-700 mb-6">
            Be the first to post a privacy-preserving job opportunity!
          </p>
          <Link to="/employer/new" className="btn-primary">
            Post a Job
          </Link>
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;
