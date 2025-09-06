import React from 'react';
import { ApplicationStatus } from '../../lib/types';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ApplicationStatus.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return '⏳';
      case ApplicationStatus.APPROVED:
        return '✅';
      case ApplicationStatus.REJECTED:
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()} ${className}`}
    >
      <span>{getStatusIcon()}</span>
      <span>{status}</span>
    </span>
  );
};

export default ApplicationStatusBadge;
