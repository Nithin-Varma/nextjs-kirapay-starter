// KiraPay API Types
export interface CreateLinkRequest {
  receiver: string;
  price: number;
  name?: string;
  customOrderId?: string;
  redirectUrl?: string;
  type?: "single_use" | "unlimited";
}

export interface CreateLinkResponse {
  url: string;
}

export interface LinkTokenOut {
  symbol: string;
  decimals: number;
  address: string;
  chainId: string;
  amount: string;
}

export interface LinkTransaction {
  status: string;
  protocol: string;
  sender: string;
  receiver: string;
  amount: string;
  tokenIn?: {
    symbol: string;
    amount: string;
  };
  settlementAmount?: string;
  tokenOut?: {
    symbol: string;
  };
  createdAt: string;
}

export interface PaymentLinkDetail {
  _id: string;
  code: string;
  price: number;
  name?: string;
  receiver: string;
  tokenOut?: LinkTokenOut;
  type?: "single_use" | "unlimited";
  status?: "active" | "used" | "expired" | "disabled";
  fiatCurrency?: string;
  redirectUrl?: string;
  customOrderId?: string;
  expiredAt?: string;
  createdAt: string;
  user?: {
    _id: string;
    username: string;
  };
  project?: {
    _id: string;
    name: string;
  };
  url?: string;
  txs?: LinkTransaction[];
}

export interface GetLinkByCodeResponse extends PaymentLinkDetail {}

export interface CreateWebhookRequest {
  url: string;
  secret: string;
}

export interface Webhook {
  _id: string;
  url: string;
  createdAt: string;
}

export interface CreateWebhookResponse {
  message: string;
  webhook: Webhook;
}

export type GetWebhookResponse =
  | Webhook
  | {
      message: string;
    };

export interface DeleteWebhookResponse {
  message: string;
}

export interface WebhookEventPayload {
  event: "transaction.created" | "transaction.succeeded" | "transaction.failed" | "transaction.refund";
  timestamp: string;
  data: {
    transactionId: string;
    linkCode: string;
    customOrderId?: string;
    amount: string;
    currency: string;
    sender: string;
    receiver: string;
    status: string;
    settlementAmount?: string;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
}
