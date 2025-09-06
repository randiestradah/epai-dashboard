#!/bin/bash

# Connect dashboard to App Runner with DynamoDB

set -e

echo "🚀 Connecting EPAI Dashboard to AWS App Runner..."

# 1. Setup dashboard tables
echo "📋 Setting up dashboard tables..."
./setup-dashboard-tables.sh

# 2. Update environment variables
echo "🔧 Updating .env.local with AWS credentials..."
cat > .env.local << EOF
NODE_ENV=production
AWS_REGION=ap-southeast-3
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile epai-database)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile epai-database)
FIREBASE_PROJECT_ID=epai-assistant
ADMIN_API_SECRET=your-admin-secret-key
FIREBASE_FUNCTIONS_URL=https://us-central1-epai-assistant.cloudfunctions.net
EOF

# 3. Test DynamoDB connection
echo "🧪 Testing DynamoDB connection..."
aws dynamodb list-tables --region ap-southeast-3 --profile epai-database

# 4. Deploy to App Runner
echo "🚀 Deploying to App Runner..."
./deploy-aws.sh

echo "✅ Dashboard connected to App Runner with DynamoDB!"
echo "📊 Dashboard tables: dashboard_metrics, dashboard_activity, dashboard_sessions"