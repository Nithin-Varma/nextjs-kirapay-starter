"use client";

import { useState, useEffect } from "react";
import { Copy, ExternalLink, Link as LinkIcon } from "lucide-react";
import { PaymentLink } from "@/types/kirapay";
import { getPaymentLinks } from "@/lib/kirapay-api";

interface LinksListProps {
  onCopySuccess: (message: string) => void;
}

export default function LinksList({ onCopySuccess }: LinksListProps) {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLinks = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await getPaymentLinks(pageNum, 10);
      setLinks(response.data.links);
      setTotal(response.data.total);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch links:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onCopySuccess('Copied to clipboard!');
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          My Payment Links
        </h2>
        <button
          onClick={() => fetchLinks(page)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && links.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading links...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-12">
          <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No payment links found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {link.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {link.price} {link.tokenOut.symbol}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Created: {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    Code: {link.code}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(`https://dapper-treacle-66c18b.netlify.app/${link.code}`)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => window.open(`https://dapper-treacle-66c18b.netlify.app/${link.code}`, '_blank')}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          {total > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => fetchLinks(page - 1)}
                disabled={page === 1 || loading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                Page {page} of {Math.ceil(total / 10)}
              </span>
              <button
                onClick={() => fetchLinks(page + 1)}
                disabled={page >= Math.ceil(total / 10) || loading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
