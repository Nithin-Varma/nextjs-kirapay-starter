"use client";

import { CheckCircle, AlertCircle } from "lucide-react";

interface StatusMessageProps {
  type: 'success' | 'error';
  message: string;
}

export default function StatusMessage({ type, message }: StatusMessageProps) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle : AlertCircle;
  const bgColor = isSuccess 
    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  const textColor = isSuccess 
    ? 'text-green-700 dark:text-green-300' 
    : 'text-red-700 dark:text-red-300';
  const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';

  return (
    <div className="max-w-2xl mx-auto mb-6">
      <div className={`${bgColor} border rounded-lg p-4 flex items-center gap-2`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <span className={textColor}>{message}</span>
      </div>
    </div>
  );
}
