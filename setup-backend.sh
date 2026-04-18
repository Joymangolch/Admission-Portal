#!/bin/bash

# MTU Admission Portal - Backend Quick Start Script
# This script sets up the backend environment

set -e

echo "🚀 MTU Admission Portal - Backend Setup"
echo "======================================"

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install @prisma/client
npm install firebase-admin
npm install razorpay
npm install @google-cloud/storage
npm install @sendgrid/mail
npm install jsonwebtoken zod

# Step 2: Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Step 3: Check environment file
if [ ! -f .env.local ]; then
  echo "⚠️  .env.local not found!"
  echo "👉 Please copy .env.example to .env.local and configure:"
  echo "   - DATABASE_URL"
  echo "   - Firebase credentials"
  echo "   - Razorpay keys"
  echo "   - GCS configuration"
  echo "   - SendGrid API key"
  exit 1
fi

echo "✅ Environment file found"

# Step 4: Run migrations (if database is configured)
echo "📊 Running database migrations..."
npx prisma migrate dev --name initial || echo "⚠️  Migration failed - check DATABASE_URL"

# Step 5: Generate Prisma Studio
echo "🎨 Prisma Studio available at: npx prisma studio"

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "🚀 To start development server:"
echo "   npm run dev"
echo ""
echo "📖 Documentation:"
echo "   - API Guide: ./BACKEND_API_GUIDE.md"
echo "   - Implementation Status: ./BACKEND_IMPLEMENTATION_STATUS.md"
echo "   - Integration Checklist: ./BACKEND_INTEGRATION_CHECKLIST.md"
echo ""
