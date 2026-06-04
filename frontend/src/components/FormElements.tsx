import React from 'react';
import { AlertCircle, Loader } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24 }) => {
  return <Loader size={size} className="animate-spin" />;
};

interface SubmitButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  children,
  disabled,
  className = '',
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`w-full py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
        isLoading || disabled
          ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
          : 'bg-gradient-neon text-white hover:shadow-md-soft'
      } ${className}`}
    >
      {isLoading && <LoadingSpinner size={16} />}
      {children}
    </button>
  );
};
