# KiraPay API Integration Setup

This project demonstrates how to integrate with the KiraPay API using Next.js. It provides a complete example of creating payment links, managing transactions, and looking up link details.

## Environment Setup

1. Create a `.env` file in the root directory:

```bash
# KiraPay API Configuration
NEXT_PUBLIC_KIRAPAY_API_KEY=your_kirapay_api_key_here
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
│   ├── LinksList.tsx       # Display and manage payment links
│   ├── TransactionsList.tsx # View and filter transactions
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

### 2. Get User Links
- **Endpoint**: `GET /link`
- **Purpose**: Retrieve paginated list of user's payment links
- **Authentication**: Required (API key)

### 3. Get Link by Code
- **Endpoint**: `GET /link/{code}`
- **Purpose**: Get link details by code (public endpoint)
- **Authentication**: Not required

### 4. Get Wallet Transactions
- **Endpoint**: `GET /wallet/transactions`
- **Purpose**: Retrieve paginated list of transactions with filters
- **Authentication**: Required (API key)

## Usage Examples

### Creating a Payment Link

```typescript
import { createPaymentLink } from '@/lib/kirapay-api';

const response = await createPaymentLink({
  currency: 'USDC',
  receiver: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  price: 100.5,
  name: 'Order #A1209',
  redirectUrl: 'https://merchant.example.com/thank-you'
});
```

### Getting User Links

```typescript
import { getPaymentLinks } from '@/lib/kirapay-api';

const response = await getPaymentLinks(1, 10); // page 1, limit 10
console.log(response.data.links);
```

### Looking up a Link by Code

```typescript
import { getLinkByCode } from '@/lib/kirapay-api';

const response = await getLinkByCode('abc123def4');
console.log(response.data);
```

### Getting Transactions with Filters

```typescript
import { getTransactions } from '@/lib/kirapay-api';

const response = await getTransactions({
  status: 'COMPLETED',
  from_date: '2025-01-01T00:00:00.000Z',
  to_date: '2025-01-31T23:59:59.999Z',
  page: 1,
  limit: 10
});
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
import { createPaymentLink, getPaymentLinks, getLinkByCode, getTransactions } from '@/lib/kirapay-api';

// Create a payment link
const response = await createPaymentLink({
  currency: 'USDC',
  receiver: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  price: 100.5,
  name: 'Order #A1209'
});

// Get user links
const links = await getPaymentLinks(1, 10);

// Lookup link by code
const linkDetails = await getLinkByCode('abc123def4');

// Get transactions with filters
const transactions = await getTransactions({
  status: 'COMPLETED',
  page: 1,
  limit: 10
});
```


## Support

For KiraPay API support, please refer to the official [KiraPay](https://www.kira-pay.com/) documentation or contact their support team.
