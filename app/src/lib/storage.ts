/**
 * Local storage repository for jobs and applications
 */

import { JobListing, ApplicationRecord, ApplicationStatus } from './types';

const JOBS_KEY = 'zkjb:jobs';
const APPLICATIONS_KEY = 'zkjb:applications';

/**
 * Local Job Repository
 */
export class LocalJobRepo {
  async list(): Promise<JobListing[]> {
    try {
      const data = localStorage.getItem(JOBS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to load jobs:', error);
      return [];
    }
  }

  async create(job: JobListing): Promise<JobListing> {
    const jobs = await this.list();
    jobs.push(job);
    await this.saveAll(jobs);
    return job;
  }

  async findById(id: string): Promise<JobListing | null> {
    const jobs = await this.list();
    return jobs.find(j => j.id === id) || null;
  }

  async saveAll(jobs: JobListing[]): Promise<void> {
    try {
      localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    } catch (error) {
      console.error('Failed to save jobs:', error);
      throw error;
    }
  }
}

/**
 * Local Application Repository
 */
export class LocalApplicationRepo {
  async list(): Promise<ApplicationRecord[]> {
    try {
      const data = localStorage.getItem(APPLICATIONS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      // Ensure all applications have a status (for backward compatibility)
      return parsed.map((app: any) => ({
        ...app,
        status: app.status || ApplicationStatus.PENDING
      }));
    } catch (error) {
      console.error('Failed to load applications:', error);
      return [];
    }
  }

  async create(app: ApplicationRecord): Promise<ApplicationRecord> {
    const apps = await this.list();
    // Ensure new applications start as PENDING
    const newApp = {
      ...app,
      status: app.status || ApplicationStatus.PENDING
    };
    apps.push(newApp);
    await this.saveAll(apps);
    return newApp;
  }

  async findByJobId(jobId: string): Promise<ApplicationRecord[]> {
    const apps = await this.list();
    return apps.filter(a => a.jobId === jobId);
  }

  async findById(id: string): Promise<ApplicationRecord | null> {
    const apps = await this.list();
    return apps.find(a => a.id === id) || null;
  }

  async updateApplication(app: ApplicationRecord): Promise<ApplicationRecord> {
    const apps = await this.list();
    const index = apps.findIndex(a => a.id === app.id);
    
    if (index === -1) {
      throw new Error(`Application with id ${app.id} not found`);
    }
    
    apps[index] = app;
    await this.saveAll(apps);
    return app;
  }

  async saveAll(apps: ApplicationRecord[]): Promise<void> {
    try {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
    } catch (error) {
      console.error('Failed to save applications:', error);
      throw error;
    }
  }
}

// Singleton instances
export const jobRepo = new LocalJobRepo();
export const applicationRepo = new LocalApplicationRepo();

// Helper functions for direct access
export const getJobs = (): Promise<JobListing[]> => jobRepo.list();
export const saveJobs = (jobs: JobListing[]): Promise<void> => jobRepo.saveAll(jobs);
export const getApplications = (): Promise<ApplicationRecord[]> => applicationRepo.list();
export const saveApplications = (apps: ApplicationRecord[]): Promise<void> => applicationRepo.saveAll(apps);
