#!/bin/bash

# Deploy to Vercel with DynamoDB Jakarta

echo "🚀 Deploying to Vercel..."

# Install Vercel CLI if not exists
if ! command -v vercel &> /dev/null; then
    npm install -g vercel
fi

# Set environment variables
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile epai-database)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile epai-database)

vercel env add AWS_REGION ap-southeast-3
vercel env add AWS_ACCESS_KEY_ID $AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY $AWS_SECRET_ACCESS_KEY
vercel env add ADMIN_API_SECRET epai-admin-2024

# Deploy
vercel --prod

echo "✅ Dashboard deployed to Vercel!"
echo "🌐 DynamoDB: Jakarta | Frontend: Global CDN"