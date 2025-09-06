#!/bin/bash

# Deploy dashboard to App Runner Singapore with DynamoDB Jakarta

set -e

echo "🚀 Deploying to App Runner Singapore (connects to DynamoDB Jakarta)..."

# Get credentials
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile epai-database)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile epai-database)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --profile epai-database)

# ECR in Singapore
REPO_NAME="epai-dashboard"
IMAGE_URI="$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/$REPO_NAME"

echo "📦 Creating ECR repository in Singapore..."
aws ecr create-repository --repository-name $REPO_NAME --region ap-southeast-1 --profile epai-database || true

echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ap-southeast-1 --profile epai-database | docker login --username AWS --password-stdin $IMAGE_URI

echo "🏗️ Building and pushing..."
docker build -t $REPO_NAME .
docker tag $REPO_NAME:latest $IMAGE_URI:latest
docker push $IMAGE_URI:latest

echo "🚀 Creating App Runner service..."
aws apprunner create-service \
  --service-name epai-dashboard \
  --source-configuration "{
    \"ImageRepository\": {
      \"ImageIdentifier\": \"$IMAGE_URI:latest\",
      \"ImageConfiguration\": {
        \"Port\": \"3001\",
        \"RuntimeEnvironmentVariables\": {
          \"NODE_ENV\": \"production\",
          \"AWS_REGION\": \"ap-southeast-3\",
          \"AWS_ACCESS_KEY_ID\": \"$AWS_ACCESS_KEY_ID\",
          \"AWS_SECRET_ACCESS_KEY\": \"$AWS_SECRET_ACCESS_KEY\",
          \"ADMIN_API_SECRET\": \"epai-admin-2024\"
        }
      },
      \"ImageRepositoryType\": \"ECR\"
    },
    \"AutoDeploymentsEnabled\": true
  }" \
  --instance-configuration '{
    "Cpu": "0.25 vCPU",
    "Memory": "0.5 GB"
  }' \
  --region ap-southeast-1 \
  --profile epai-database

echo "✅ Dashboard deployed to Singapore!"
echo "🌐 DynamoDB: Jakarta | App Runner: Singapore"