import {
  CreateLinkRequest,
  CreateLinkResponse,
  GetLinkByCodeResponse,
  CreateWebhookRequest,
  CreateWebhookResponse,
  GetWebhookResponse,
  DeleteWebhookResponse
} from '@/types/kirapay';

const makeApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(endpoint, {
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
  const response = await makeApiRequest<CreateLinkResponse>('/api/kirapay/link/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  console.log('createPaymentLink response', response);
  return response;
};

// get payment link details by code (public endpoint)
export const getLinkByCode = async (code: string): Promise<GetLinkByCodeResponse> => {
  const response = await makeApiRequest<GetLinkByCodeResponse>(`/api/kirapay/link/${code}`);
  console.log('getLinkByCode response', response);
  return response;
};

// configure or update webhook endpoint
export const createWebhook = async (request: CreateWebhookRequest): Promise<CreateWebhookResponse> => {
  const response = await makeApiRequest<CreateWebhookResponse>('/api/kirapay/webhooks', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  console.log('createWebhook response', response);
  return response;
};

// get configured webhook endpoint
export const getWebhook = async (): Promise<GetWebhookResponse> => {
  const response = await makeApiRequest<GetWebhookResponse>('/api/kirapay/webhooks');
  console.log('getWebhook response', response);
  return response;
};

// delete configured webhook endpoint
export const deleteWebhook = async (): Promise<DeleteWebhookResponse> => {
  const response = await makeApiRequest<DeleteWebhookResponse>('/api/kirapay/webhooks', {
    method: 'DELETE',
  });
  console.log('deleteWebhook response', response);
  return response;
};
