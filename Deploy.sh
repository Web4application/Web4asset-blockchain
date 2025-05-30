#!/bin/bash
set -e

echo "🚀 Deploying Cloudflare Worker..."
wrangler publish workers/ipfs-metadata-handler.js

echo "🚀 Deploying backend API..."
# Assuming deployment via serverless or custom script; replace with your deploy command
cd backend
npm run deploy || { echo 'Backend deployment failed'; exit 1; }
cd ..

echo "🚀 Deploying smart contract on Sepolia..."
npx hardhat run scripts/deploy.js --network sepolia

echo "✅ Deployment completed successfully."
