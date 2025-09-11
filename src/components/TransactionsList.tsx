"use client";

import { useState, useEffect } from "react";
import { Copy, Filter, Wallet } from "lucide-react";
import { Transaction, TransactionFilters } from "@/types/kirapay";
import { getAllTransactions } from "@/lib/kirapay-api";

interface TransactionsListProps {
  onCopySuccess: (message: string) => void;
}

export default function TransactionsList({ onCopySuccess }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<TransactionFilters>({
    status: '',
    transaction_hash: '',
    from_date: '',
    to_date: '',
    page: 1,
    limit: 10
  });

  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await getAllTransactions();
      setTransactions(response.data.transactions);
      console.log('response', response);
      setTotal(response.data.total);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onCopySuccess('Copied to clipboard!');
  };

  const applyFilters = () => {
    fetchTransactions(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      transaction_hash: '',
      from_date: '',
      to_date: '',
      page: 1,
      limit: 10
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Wallet Transactions
        </h2>
        <button
          onClick={() => fetchTransactions(page)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Transaction Filters */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          <input
            type="text"
            value={filters.transaction_hash || ''}
            onChange={(e) => setFilters({ ...filters, transaction_hash: e.target.value })}
            placeholder="Transaction Hash"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          />
          
          <input
            type="date"
            value={filters.from_date || ''}
            onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          />
          
          <input
            type="date"
            value={filters.to_date || ''}
            onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          />
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={applyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {transaction.amount} {transaction.token}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    Hash: {transaction.transaction_hash.slice(0, 10)}...
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(transaction.transaction_hash)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Copy transaction hash"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          {total > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => fetchTransactions(page - 1)}
                disabled={page === 1 || loading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                Page {page} of {Math.ceil(total / 10)}
              </span>
              <button
                onClick={() => fetchTransactions(page + 1)}
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
