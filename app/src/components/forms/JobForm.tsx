/**
 * Job posting form component
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Input, MultiSelect } from '../ui/Field';
import { jobPolicySchema, JobPolicyInput, getAllowedSkills, getAllowedRegions } from '../../lib/validation';
import { RegionCode } from '../../lib/types';
import { useJobsStore } from '../../state/jobs.store';

export const JobForm: React.FC = () => {
  const navigate = useNavigate();
  const addJob = useJobsStore(state => state.addJob);
  
  const [formData, setFormData] = useState<JobPolicyInput>({
    title: '',
    company: '',
    requiredSkills: [],
    minExperienceYears: 0,
    allowedRegions: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = jobPolicySchema.parse(formData);
      
      // Add job to store
      const newJob = await addJob(validatedData);
      
      // Navigate to job detail page
      navigate(`/job/${newJob.id}`);
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: error.message || 'Failed to create job' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errors.general}
        </div>
      )}

      <Field label="Job Title" error={errors.title} required>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Senior ZK Engineer"
          error={!!errors.title}
        />
      </Field>

      <Field label="Company" error={errors.company} required>
        <Input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="e.g., CryptoTech Inc"
          error={!!errors.company}
        />
      </Field>

      <Field label="Required Skills (1-5)" error={errors.requiredSkills} required>
        <MultiSelect
          options={getAllowedSkills()}
          selected={formData.requiredSkills}
          onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
          error={!!errors.requiredSkills}
          maxItems={5}
        />
      </Field>

      <Field label="Minimum Experience (Years)" error={errors.minExperienceYears} required>
        <Input
          type="number"
          min="0"
          max="40"
          value={formData.minExperienceYears}
          onChange={(e) => setFormData({ ...formData, minExperienceYears: parseInt(e.target.value) || 0 })}
          error={!!errors.minExperienceYears}
        />
      </Field>

      <Field label="Allowed Regions (1-5)" error={errors.allowedRegions} required>
        <MultiSelect
          options={getAllowedRegions()}
          selected={formData.allowedRegions}
          onChange={(regions) => setFormData({ ...formData, allowedRegions: regions as RegionCode[] })}
          error={!!errors.allowedRegions}
          maxItems={5}
        />
      </Field>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={() => navigate('/jobs')}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Creating...' : 'Post Job'}
        </button>
      </div>
    </form>
  );
};
