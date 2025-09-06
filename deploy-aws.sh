#!/bin/bash

# EPAI Dashboard AWS App Runner Deployment

set -e

echo "🚀 Deploying EPAI Dashboard to AWS App Runner..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Build and push to ECR in Singapore
REGION="ap-southeast-3"
SINGAPORE_REGION="ap-southeast-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --profile epai-database)
REPO_NAME="epai-dashboard"
SINGAPORE_IMAGE_URI="$ACCOUNT_ID.dkr.ecr.$SINGAPORE_REGION.amazonaws.com/$REPO_NAME"
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile epai-database)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile epai-database)

echo "📦 Creating ECR repository in Singapore..."
aws ecr create-repository --repository-name $REPO_NAME --region $SINGAPORE_REGION --profile epai-database || true

echo "🔐 Logging into ECR Singapore..."
aws ecr get-login-password --region $SINGAPORE_REGION --profile epai-database | docker login --username AWS --password-stdin $SINGAPORE_IMAGE_URI

echo "🏗️ Building Docker image..."
docker build -t $REPO_NAME .
docker tag $REPO_NAME:latest $SINGAPORE_IMAGE_URI:latest

echo "📤 Pushing to ECR Singapore..."
docker push $SINGAPORE_IMAGE_URI:latest

echo "🚀 Creating App Runner service in Singapore..."
aws apprunner create-service \
  --service-name epai-dashboard \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "'$SINGAPORE_IMAGE_URI':latest",
      "ImageConfiguration": {
        "Port": "3001",
        "RuntimeEnvironmentVariables": {
          "NODE_ENV": "production",
          "AWS_REGION": "ap-southeast-3",
          "AWS_ACCESS_KEY_ID": "'$AWS_ACCESS_KEY_ID'",
          "AWS_SECRET_ACCESS_KEY": "'$AWS_SECRET_ACCESS_KEY'"
        }
      },
      "ImageRepositoryType": "ECR"
    },
    "AutoDeploymentsEnabled": true
  }' \
  --instance-configuration '{
    "Cpu": "0.25 vCPU",
    "Memory": "0.5 GB"
  }' \
  --region ap-southeast-1 \
  --profile epai-database

echo "✅ Dashboard deployed to AWS App Runner!"
echo "🌐 Service URL will be available in AWS Console"