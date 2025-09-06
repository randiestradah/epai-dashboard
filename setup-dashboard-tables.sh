#!/bin/bash

# Create dashboard-specific DynamoDB tables

echo "🗄️ Creating dashboard tables..."

# Dashboard metrics table
aws dynamodb create-table \
  --table-name dashboard_metrics \
  --attribute-definitions \
    AttributeName=metricId,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=metricId,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-3 \
  --profile epai-database

# Dashboard activity logs
aws dynamodb create-table \
  --table-name dashboard_activity \
  --attribute-definitions \
    AttributeName=activityId,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=activityId,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-3 \
  --profile epai-database

# Dashboard admin sessions
aws dynamodb create-table \
  --table-name dashboard_sessions \
  --attribute-definitions \
    AttributeName=sessionId,AttributeType=S \
  --key-schema \
    AttributeName=sessionId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-3 \
  --profile epai-database

echo "✅ Dashboard tables created!"