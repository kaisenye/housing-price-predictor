#!/bin/bash

# Install dependencies
npm install

# Create data directory
mkdir -p data

# Build the Next.js app
npm run build

# Notify that we're using JS fallback on Vercel
echo "Notice: Using JavaScript fallback for predictions when deployed on Vercel"

# Exit with success
exit 0 