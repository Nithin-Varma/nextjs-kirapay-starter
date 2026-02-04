"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { CreateLinkRequest } from "@/types/kirapay";
import { createPaymentLink } from "@/lib/kirapay-api";

interface CreateLinkFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function CreateLinkForm({ onSuccess, onError }: CreateLinkFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateLinkRequest>({
    receiver: '',
    price: 0,
    name: '',
    customOrderId: '',
    redirectUrl: '',
    type: 'single_use'
  });

  const handleCreatePaymentLink = async () => {
    if (!formData.receiver || !formData.price) {
      onError('Please fill in the required fields');
      return;
    }

    setLoading(true);
    onError('');

    try {
      const response = await createPaymentLink({
        receiver: formData.receiver,
        price: formData.price,
        name: formData.name || undefined,
        customOrderId: formData.customOrderId || undefined,
        redirectUrl: formData.redirectUrl || undefined,
        type: formData.type || undefined
      });
      
      onSuccess(`Payment link created successfully! Link: ${response.url}`);
      setFormData({
        receiver: '',
        price: 0,
        name: '',
        customOrderId: '',
        redirectUrl: '',
        type: 'single_use'
      });
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to create payment link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Create Payment Link
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Receiver Address *
          </label>
          <input
            type="text"
            value={formData.receiver}
            onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
            placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Link Type
          </label>
          <select
            value={formData.type || 'single_use'}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as CreateLinkRequest['type'] })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="single_use">Single use</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Order ID (Optional)
          </label>
          <input
            type="text"
            value={formData.customOrderId}
            onChange={(e) => setFormData({ ...formData, customOrderId: e.target.value })}
            placeholder="ORDER-123456"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Name (Optional)
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Order #A1209"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Redirect URL (Optional)
          </label>
          <input
            type="url"
            value={formData.redirectUrl}
            onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
            placeholder="https://merchant.example.com/thank-you"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <button
        onClick={handleCreatePaymentLink}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Creating Link...
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" />
            Create Payment Link
          </>
        )}
      </button>
    </div>
  );
}
