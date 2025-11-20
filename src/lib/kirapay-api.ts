import {
  CreateLinkRequest,
  CreateLinkResponse,
  GetLinksResponse,
  GetLinkByCodeResponse,
  GetTransactionsResponse,
  TransactionFilters
} from '@/types/kirapay';

const API_BASE_URL = 'https://kirapay-api.holatech.app/api';

// get the API key from environment variables
const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_KIRAPAY_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_KIRAPAY_API_KEY environment variable is required');
  }
  return apiKey;
};

// for any routes where authentication is required
const makeAuthenticatedRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const apiKey = getApiKey();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// for any routes where authentication is not required
const makePublicRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};


// create a new payment link
export const createPaymentLink = async (request: CreateLinkRequest): Promise<CreateLinkResponse> => {
  const response = await makeAuthenticatedRequest<CreateLinkResponse>('/link/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  console.log('createPaymentLink response', response);
  return response;
};

// get user's payment links with pagination
export const getPaymentLinks = async (page: number = 1, limit: number = 10): Promise<GetLinksResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await makeAuthenticatedRequest<GetLinksResponse>(`/link?${params}`);
  console.log('getPaymentLinks response', response);
  return response;
};

// get payment link details by code (public endpoint)
export const getLinkByCode = async (code: string): Promise<GetLinkByCodeResponse> => {
  const response = await makePublicRequest<GetLinkByCodeResponse>(`/link/${code}`);
  console.log('getLinkByCode response', response);
  return response;
};

// get wallet transactions with optional filters
export const getTransactions = async (filters: TransactionFilters = {}): Promise<GetTransactionsResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await makeAuthenticatedRequest<GetTransactionsResponse>(`/wallet/transactions?${params}`);
  console.log('getTransactions response', response);
  return response;
};

// get all transactions
export const getAllTransactions = async (): Promise<GetTransactionsResponse> => {
  const response = await makeAuthenticatedRequest<GetTransactionsResponse>('/wallet/transactions');
  console.log('getAllTransactions response', response);
  return response;
};
