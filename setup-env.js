#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envExample = `# KiraPay API Configuration
NEXT_PUBLIC_KIRAPAY_API_KEY=your_kirapay_api_key_here

# Note: Replace 'your_kirapay_api_key_here' with your actual KiraPay API key
# This key will be used for all API calls in the demo`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envExample);
  console.log('✅ Created .env.local file');
  console.log('📝 Please edit .env.local and add your KiraPay API key');
} else {
  console.log('⚠️  .env.local already exists');
}

console.log('\n🚀 Setup complete! Run "npm run dev" to start the development server');
