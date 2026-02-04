"use client";

import { useEffect, useState } from "react";
import { Trash2, RefreshCw, Save } from "lucide-react";
import { CreateWebhookRequest, Webhook, GetWebhookResponse } from "@/types/kirapay";
import { createWebhook, getWebhook, deleteWebhook } from "@/lib/kirapay-api";

interface WebhookManagerProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function WebhookManager({ onSuccess, onError }: WebhookManagerProps) {
  const [formData, setFormData] = useState<CreateWebhookRequest>({
    url: "",
    secret: ""
  });
  const [currentWebhook, setCurrentWebhook] = useState<Webhook | null>(null);
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resolveWebhook = (response: GetWebhookResponse) => {
    if ("message" in response) {
      setCurrentWebhook(null);
      setInfoMessage(response.message);
      return;
    }

    setCurrentWebhook(response);
    setInfoMessage("");
  };

  const fetchWebhook = async () => {
    setLoading(true);
    onError("");
    try {
      const response = await getWebhook();
      resolveWebhook(response);
      onSuccess("Webhook status refreshed");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to fetch webhook");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.url || !formData.secret) {
      onError("Webhook URL and secret are required");
      return;
    }

    setLoading(true);
    onError("");
    try {
      const response = await createWebhook(formData);
      setCurrentWebhook(response.webhook);
      setInfoMessage("");
      onSuccess(response.message || "Webhook saved");
      setFormData({ ...formData, secret: "" });
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save webhook");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    onError("");
    try {
      const response = await deleteWebhook();
      setCurrentWebhook(null);
      setInfoMessage(response.message);
      onSuccess(response.message);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete webhook");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhook();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Webhook Settings
        </h2>
        <button
          onClick={fetchWebhook}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Webhook URL *
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://your-server.com/api/kirapay-webhook"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Webhook Secret *
          </label>
          <input
            type="password"
            value={formData.secret}
            onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
            placeholder="Min 6 characters"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Webhook
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Webhook
          </h3>
          <button
            onClick={handleDelete}
            disabled={loading || !currentWebhook}
            className="text-red-600 hover:text-red-700 disabled:text-gray-400 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>

        {currentWebhook ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              URL: <span className="font-mono">{currentWebhook.url}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Created: {new Date(currentWebhook.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {infoMessage || "No webhook configured"}
          </p>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Webhook Events
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          The KiraPay API sends events for: <span className="font-mono">transaction.created</span>,
          <span className="font-mono"> transaction.succeeded</span>,
          <span className="font-mono"> transaction.failed</span>,
          <span className="font-mono"> transaction.refund</span>.
        </p>
      </div>
    </div>
  );
}
