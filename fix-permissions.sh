#!/bin/bash

# Add ECR permissions to epai-database user

echo "🔧 Adding ECR permissions to epai-database user..."

aws iam attach-user-policy \
  --user-name epai-database \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess \
  --profile epai-database

aws iam attach-user-policy \
  --user-name epai-database \
  --policy-arn arn:aws:iam::aws:policy/AWSAppRunnerFullAccess \
  --profile epai-database

echo "✅ Permissions added!"
echo "🚀 Now run: ./deploy-singapore.sh"