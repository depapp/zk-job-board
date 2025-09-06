/**
 * Reusable form field components
 */

import React from 'react';

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, error, required, children }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ error, className = '', ...props }) => {
  return (
    <input
      className={`form-input ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ error, options, className = '', ...props }) => {
  return (
    <select
      className={`form-input ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    >
      <option value="">Select...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: boolean;
  maxItems?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  selected, 
  onChange, 
  error,
  maxItems 
}) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      if (!maxItems || selected.length < maxItems) {
        onChange([...selected, option]);
      }
    }
  };

  return (
    <div className={`border rounded-lg p-3 max-h-48 overflow-y-auto ${error ? 'border-red-500' : 'border-gray-300'}`}>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selected.includes(option)
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={!selected.includes(option) && maxItems && selected.length >= maxItems}
          >
            {option}
          </button>
        ))}
      </div>
      {maxItems && (
        <p className="text-xs text-gray-500 mt-2">
          {selected.length}/{maxItems} selected
        </p>
      )}
    </div>
  );
};
