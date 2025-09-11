"use client";

import { useState } from "react";
import { Plus, Link as LinkIcon, Wallet } from "lucide-react";
import CreateLinkForm from "@/components/CreateLinkForm";
import LinksList from "@/components/LinksList";
import TransactionsList from "@/components/TransactionsList";
import LinkLookup from "@/components/LinkLookup";
import StatusMessage from "@/components/StatusMessage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'links' | 'transactions'>('create');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleError = (message: string) => {
    setError(message);
    setSuccess('');
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError('');
    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(''), 5000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            KiraPay API Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create payment links, manage transactions, and explore the KiraPay API
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Configure your API key in the environment variables to get started
          </p>
        </div>

        {/* Status Messages */}
        <StatusMessage type="error" message={error} />
        <StatusMessage type="success" message={success} />

        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'create', label: 'Create Link', icon: Plus },
                { id: 'links', label: 'My Links', icon: LinkIcon },
                { id: 'transactions', label: 'Transactions', icon: Wallet }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as 'create' | 'links' | 'transactions')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'create' && (
                <CreateLinkForm
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}

              {activeTab === 'links' && (
                <LinksList onCopySuccess={handleSuccess} />
              )}

              {activeTab === 'transactions' && (
                <TransactionsList onCopySuccess={handleSuccess} />
              )}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          <LinkLookup onError={handleError} onCopySuccess={handleSuccess} />
        </div>

        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>KiraPay API Integration Demo - Built with Next.js</p>
        </div>
      </div>
    </div>
  );
}
