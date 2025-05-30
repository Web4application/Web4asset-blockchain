#!/bin/bash
set -e

echo "🛠️ Starting build process..."

# Frontend build
cd web4asset-dapp
echo "🔨 Building React/Vite frontend..."
npm install
npm run build
cd ..

# Backend build (if needed)
cd backend
echo "🔨 Installing backend dependencies..."
npm install
cd ..

echo "✅ Build completed successfully."
