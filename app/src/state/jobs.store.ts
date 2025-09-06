/**
 * Zustand store for jobs and applications state management
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { JobListing, ApplicationRecord, ApplicationStatus, ReviewDecisionInput } from '../lib/types';
import { jobRepo, applicationRepo } from '../lib/storage';
import { JobPolicyInput } from '../lib/validation';

interface JobsState {
  // State
  jobs: JobListing[];
  applications: ApplicationRecord[];
  isLoading: boolean;
  
  // Actions
  loadFromRepo: () => Promise<void>;
  addJob: (policyInput: JobPolicyInput) => Promise<JobListing>;
  getJobById: (id: string) => JobListing | undefined;
  addApplication: (app: Omit<ApplicationRecord, 'id' | 'createdAt' | 'status'>) => Promise<ApplicationRecord>;
  getApplicationsByJob: (jobId: string) => ApplicationRecord[];
  checkIfApplied: (jobId: string, nullifier: string) => boolean;
  getApplicationById: (id: string) => ApplicationRecord | undefined;
  getApplicationByNullifier: (jobId: string, nullifier: string) => ApplicationRecord | undefined;
  updateApplicationStatus: (input: ReviewDecisionInput) => Promise<ApplicationRecord>;
  getApplicationsByStatus: (jobId: string, status: ApplicationStatus) => ApplicationRecord[];
}

export const useJobsStore = create<JobsState>((set, get) => ({
  // Initial state
  jobs: [],
  applications: [],
  isLoading: false,

  // Load data from localStorage
  loadFromRepo: async () => {
    set({ isLoading: true });
    try {
      const [jobs, applications] = await Promise.all([
        jobRepo.list(),
        applicationRepo.list()
      ]);
      set({ jobs, applications, isLoading: false });
    } catch (error) {
      console.error('Failed to load data:', error);
      set({ isLoading: false });
    }
  },

  // Add a new job
  addJob: async (policyInput: JobPolicyInput) => {
    const newJob: JobListing = {
      ...policyInput,
      id: uuidv4(),
      createdAt: Date.now()
    };

    await jobRepo.create(newJob);
    
    set(state => ({
      jobs: [...state.jobs, newJob]
    }));

    return newJob;
  },

  // Get job by ID
  getJobById: (id: string) => {
    return get().jobs.find(job => job.id === id);
  },

  // Add a new application
  addApplication: async (app: Omit<ApplicationRecord, 'id' | 'createdAt' | 'status'>) => {
    // Check for duplicate nullifier (prevent double application)
    const existing = get().applications.find(
      a => a.jobId === app.jobId && a.applicantNullifier === app.applicantNullifier
    );
    
    if (existing) {
      throw new Error('You have already applied to this job');
    }

    const newApp: ApplicationRecord = {
      ...app,
      id: uuidv4(),
      createdAt: Date.now(),
      status: ApplicationStatus.PENDING
    };

    await applicationRepo.create(newApp);
    
    set(state => ({
      applications: [...state.applications, newApp]
    }));

    return newApp;
  },

  // Get applications for a specific job
  getApplicationsByJob: (jobId: string) => {
    return get().applications.filter(app => app.jobId === jobId);
  },

  // Check if a nullifier has already been used for a job
  checkIfApplied: (jobId: string, nullifier: string) => {
    return get().applications.some(
      app => app.jobId === jobId && app.applicantNullifier === nullifier
    );
  },

  // Get application by ID
  getApplicationById: (id: string) => {
    return get().applications.find(app => app.id === id);
  },

  // Get application by nullifier
  getApplicationByNullifier: (jobId: string, nullifier: string) => {
    return get().applications.find(
      app => app.jobId === jobId && app.applicantNullifier === nullifier
    );
  },

  // Update application status (for review)
  updateApplicationStatus: async (input: ReviewDecisionInput) => {
    const { applicationId, status, note } = input;
    const app = get().applications.find(a => a.id === applicationId);
    
    if (!app) {
      throw new Error(`Application with id ${applicationId} not found`);
    }

    // Enforce transition rules
    if (app.status !== ApplicationStatus.PENDING) {
      throw new Error(`Cannot change status from ${app.status}`);
    }

    // Validate note length
    if (note && note.length > 500) {
      throw new Error('Reviewer note must be 500 characters or less');
    }

    const updatedApp: ApplicationRecord = {
      ...app,
      status,
      reviewedAt: Date.now(),
      reviewerNote: note
    };

    await applicationRepo.updateApplication(updatedApp);
    
    set(state => ({
      applications: state.applications.map(a => 
        a.id === applicationId ? updatedApp : a
      )
    }));

    return updatedApp;
  },

  // Get applications by status
  getApplicationsByStatus: (jobId: string, status: ApplicationStatus) => {
    return get().applications.filter(
      app => app.jobId === jobId && app.status === status
    );
  }
}));

// Initialize store on app load
export const initializeStore = () => {
  useJobsStore.getState().loadFromRepo();
};
