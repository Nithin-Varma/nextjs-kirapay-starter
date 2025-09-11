// KiraPay API Types
export interface PaymentLink {
  _id: string;
  code: string;
  price: number;
  tokenOut: {
    symbol: string;
    address: string;
    decimals: number;
    chain: string;
  };
  receiver: string;
  user: {
    _id: string;
    username: string;
    address: string;
    isVerified: boolean;
  };
  name: string;
  redirectUrl?: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface Transaction {
  _id: string;
  transaction_hash: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  amount: number;
  token: string;
  from: string;
  to: string;
  createdAt: string;
}

export interface CreateLinkRequest {
  currency: string;
  receiver: string;
  price: number;
  name: string;
  redirectUrl?: string;
}

export interface CreateLinkResponse {
  message: string;
  data: {
    url: string;
  };
}

export interface GetLinksResponse {
  message: string;
  data: {
    links: PaymentLink[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface GetLinkByCodeResponse {
  message: string;
  data: PaymentLink;
}

export interface GetTransactionsResponse {
  message: string;
  data: {
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface TransactionFilters {
  status?: string;
  transaction_hash?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
