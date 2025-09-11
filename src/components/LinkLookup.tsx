"use client";

import { useState } from "react";
import { Eye, Copy, X } from "lucide-react";
import { PaymentLink } from "@/types/kirapay";
import { getLinkByCode } from "@/lib/kirapay-api";

interface LinkLookupProps {
  onError: (message: string) => void;
  onCopySuccess: (message: string) => void;
}

export default function LinkLookup({ onError, onCopySuccess }: LinkLookupProps) {
  const [linkCode, setLinkCode] = useState('');
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(false);

  const getLinkWithCode = async (code: string) => {
    if (!code.trim()) {
      onError('Please enter a link code');
      return;
    }

    setLoading(true);
    onError('');

    try {
      const link = await getLinkByCode(code.trim());
      setSelectedLink(link.data);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to fetch link details');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onCopySuccess('Copied to clipboard!');
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Lookup Link by Code
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={linkCode}
            onChange={(e) => setLinkCode(e.target.value)}
            placeholder="Enter link code (e.g., abc123def4)"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && getLinkWithCode(linkCode)}
          />
          <button
            onClick={() => getLinkWithCode(linkCode)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Looking up...' : 'Lookup'}
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          This is a public endpoint - no API key required
        </p>
      </div>

      {/* Link Details Modal */}
      {selectedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Link Details
                </h3>
                <button
                  onClick={() => setSelectedLink(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedLink.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedLink.price} {selectedLink.tokenOut.symbol}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Receiver
                  </label>
                  <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                    {selectedLink.receiver}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Link Code
                  </label>
                  <p className="text-gray-900 dark:text-white font-mono text-sm">
                    {selectedLink.code}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment URL
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 dark:text-white font-mono text-sm flex-1 break-all">
                      https://kirapay.focalfossa.site/{selectedLink.code}
                    </p>
                    <button
                      onClick={() => copyToClipboard(`https://kirapay.focalfossa.site/${selectedLink.code}`)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {selectedLink.redirectUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Redirect URL
                    </label>
                    <p className="text-gray-900 dark:text-white text-sm break-all">
                      {selectedLink.redirectUrl}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created
                  </label>
                  <p className="text-gray-900 dark:text-white text-sm">
                    {new Date(selectedLink.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    User
                  </label>
                  <p className="text-gray-900 dark:text-white text-sm">
                    {selectedLink.user.username} {selectedLink.user.isVerified && '(Verified)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
