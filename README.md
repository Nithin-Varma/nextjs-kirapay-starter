# KiraPay API Integration Setup

This project demonstrates how to integrate with the KiraPay API using Next.js. It provides a complete example of creating payment links, managing webhooks, and looking up link details.

## Environment Setup

1. Create a `.env` file in the root directory:

```bash
# KiraPay API Configuration
KIRAPAY_API=your_kirapay_api_key_here
# Optional: bearer token if your setup requires it
KIRAPAY_AUTH_TOKEN=your_optional_jwt_token
# Optional: override API base URL (defaults to https://api.kira-pay.com/api)
KIRAPAY_API_BASE_URL=https://api.kira-pay.com/api
```

2. Replace `your_kirapay_api_key_here` with your actual KiraPay API key.

## Project Structure

```
src/
├── types/
│   └── kirapay.ts          # TypeScript interfaces for API types
├── lib/
│   └── kirapay-api.ts      # API service class with all endpoints
├── components/
│   ├── CreateLinkForm.tsx  # Form for creating payment links
│   ├── WebhookManager.tsx  # Configure and manage webhooks
│   ├── LinkLookup.tsx      # Lookup link details by code
│   └── StatusMessage.tsx   # Success/error message component
└── app/
    └── page.tsx            # Main page with tabbed interface
```

## API Endpoints Used

### 1. Create Payment Link
- **Endpoint**: `POST /link/generate`
- **Purpose**: Create a new payment link
- **Authentication**: Required (API key)

### 2. Get Link by Code
- **Endpoint**: `GET /link/{code}`
- **Purpose**: Get link details by code (public endpoint)
- **Authentication**: Not required

### 3. Configure Webhook
- **Endpoint**: `POST /webhooks`
- **Purpose**: Create or update the webhook endpoint
- **Authentication**: Required (API key)

### 4. Get Webhook
- **Endpoint**: `GET /webhooks`
- **Purpose**: Retrieve the configured webhook
- **Authentication**: Required (API key)

### 5. Delete Webhook
- **Endpoint**: `DELETE /webhooks`
- **Purpose**: Remove the configured webhook
- **Authentication**: Required (API key)

## Usage Examples

### Creating a Payment Link

```typescript
import { createPaymentLink } from '@/lib/kirapay-api';

const response = await createPaymentLink({
  receiver: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  price: 100.5,
  name: 'Order #A1209',
  customOrderId: 'ORDER-123456',
  type: 'single_use',
  redirectUrl: 'https://merchant.example.com/thank-you'
});
```

### Looking up a Link by Code

```typescript
import { getLinkByCode } from '@/lib/kirapay-api';

const response = await getLinkByCode('abc123def4');
console.log(response);
```

### Managing Webhooks

```typescript
import { createWebhook, getWebhook, deleteWebhook } from '@/lib/kirapay-api';

const created = await createWebhook({
  url: 'https://your-server.com/api/kirapay-webhook',
  secret: 'your_webhook_secret_key'
});

const current = await getWebhook();

const deleted = await deleteWebhook();
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables (see Environment Setup above)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Direct API Usage

You can also use the API functions directly without components:

```tsx
import { createPaymentLink, getLinkByCode, createWebhook, getWebhook, deleteWebhook } from '@/lib/kirapay-api';

// Create a payment link
const response = await createPaymentLink({
  receiver: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  price: 100.5,
  name: 'Order #A1209'
});

// Lookup link by code
const linkDetails = await getLinkByCode('abc123def4');

// Create or update webhook
const webhook = await createWebhook({
  url: 'https://your-server.com/api/kirapay-webhook',
  secret: 'your_webhook_secret_key'
});

// Read webhook
const currentWebhook = await getWebhook();

// Delete webhook
const deletedWebhook = await deleteWebhook();
```


## Support

For KiraPay API support, please refer to the official [KiraPay](https://www.kira-pay.com/) documentation or contact their support team.
