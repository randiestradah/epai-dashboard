#!/bin/bash

# Deploy from GitHub to App Runner Singapore

set -e

echo "🚀 Deploying from GitHub to App Runner Singapore..."

# Get credentials
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile epai-database)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile epai-database)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --profile epai-database)

echo "🚀 Creating App Runner service from GitHub..."
aws apprunner create-service \
  --service-name epai-dashboard \
  --source-configuration "{
    \"CodeRepository\": {
      \"RepositoryUrl\": \"https://github.com/randiestradah/epai-dashboard\",
      \"SourceCodeVersion\": {
        \"Type\": \"BRANCH\",
        \"Value\": \"master\"
      },
      \"CodeConfiguration\": {
        \"ConfigurationSource\": \"REPOSITORY\",
        \"CodeConfigurationValues\": {
          \"Runtime\": \"NODEJS_18\",
          \"BuildCommand\": \"npm install --legacy-peer-deps && npm run build\",
          \"StartCommand\": \"npm start\",
          \"Port\": \"3001\",
          \"RuntimeEnvironmentVariables\": {
            \"NODE_ENV\": \"production\",
            \"AWS_REGION\": \"ap-southeast-3\",
            \"AWS_ACCESS_KEY_ID\": \"$AWS_ACCESS_KEY_ID\",
            \"AWS_SECRET_ACCESS_KEY\": \"$AWS_SECRET_ACCESS_KEY\",
            \"ADMIN_API_SECRET\": \"epai-admin-2024\"
          }
        }
      }
    },
    \"AutoDeploymentsEnabled\": true
  }" \
  --instance-configuration '{
    "Cpu": "0.25 vCPU",
    "Memory": "0.5 GB"
  }' \
  --region ap-southeast-1 \
  --profile epai-database

echo "✅ Dashboard deployed from GitHub!"
echo "🌐 Auto-deploys on every push to master"