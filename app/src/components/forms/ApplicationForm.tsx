/**
 * Job application form component with ZK proof generation
 */

import React, { useState, useEffect } from 'react';
import { Field, Input, Select, MultiSelect } from '../ui/Field';
import { 
  applicantAttributesSchema, 
  ApplicantAttributesInput, 
  getAllowedSkills, 
  getAllowedRegions,
  generateSecret 
} from '../../lib/validation';
import { RegionCode, JobPolicy } from '../../lib/types';

interface ApplicationFormProps {
  job: JobPolicy;
  onSubmit: (attributes: ApplicantAttributesInput) => Promise<void>;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ job, onSubmit }) => {
  const [formData, setFormData] = useState<ApplicantAttributesInput>({
    skills: [],
    experienceYears: 0,
    region: RegionCode.NA,
    secret: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate secret on mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      secret: generateSecret()
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = applicantAttributesSchema.parse(formData);
      
      // Call parent's submit handler
      await onSubmit(validatedData);
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
        setErrors({ general: error.message || 'Failed to submit application' });
      }
      setIsSubmitting(false);
    }
  };

  const regionOptions = getAllowedRegions().map(r => ({
    value: r,
    label: r
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Requirements Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Job Requirements</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Required Skills: {job.requiredSkills.join(', ')}</li>
          <li>• Minimum Experience: {job.minExperienceYears} years</li>
          <li>• Allowed Regions: {job.allowedRegions.join(', ')}</li>
        </ul>
      </div>

      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errors.general}
        </div>
      )}

      <Field label="Your Skills (1-10)" error={errors.skills} required>
        <MultiSelect
          options={getAllowedSkills()}
          selected={formData.skills}
          onChange={(skills) => setFormData({ ...formData, skills })}
          error={!!errors.skills}
          maxItems={10}
        />
        <p className="text-xs text-gray-500 mt-1">
          Select all your skills. You must have all required skills to qualify.
        </p>
      </Field>

      <Field label="Years of Experience" error={errors.experienceYears} required>
        <Input
          type="number"
          min="0"
          max="40"
          value={formData.experienceYears}
          onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
          error={!!errors.experienceYears}
        />
      </Field>

      <Field label="Your Region" error={errors.region} required>
        <Select
          options={regionOptions}
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value as RegionCode })}
          error={!!errors.region}
        />
      </Field>

      <Field label="Application Secret" error={errors.secret}>
        <Input
          type="text"
          value={formData.secret}
          readOnly
          className="font-mono text-xs bg-gray-50"
          error={!!errors.secret}
        />
        <p className="text-xs text-gray-500 mt-1">
          This secret is used to generate your unique nullifier. Keep it safe if you need to prove your application later.
        </p>
      </Field>

      {/* Privacy Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">🔒 Privacy Protected</h4>
        <p className="text-sm text-green-800">
          Your actual skills, exact experience, and specific region will NOT be revealed. 
          Only a zero-knowledge proof that you meet the requirements will be submitted.
        </p>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin mr-2">⚡</span>
              Generating Proof...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );
};
