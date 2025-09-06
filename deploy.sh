#!/bin/bash

# EPAI Dashboard Deployment Script

set -e

echo "🚀 Deploying EPAI Admin Dashboard..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Please create it first."
    exit 1
fi

# Build and deploy with Docker
echo "📦 Building Docker image..."
docker build -t epai-dashboard .

echo "🔄 Stopping existing container..."
docker stop epai-dashboard || true
docker rm epai-dashboard || true

echo "🚀 Starting new container..."
docker run -d \
  --name epai-dashboard \
  --restart unless-stopped \
  -p 3001:3001 \
  --env-file .env.local \
  epai-dashboard

echo "✅ Dashboard deployed successfully!"
echo "🌐 Access at: http://localhost:3001"

# Show logs
echo "📋 Container logs:"
docker logs epai-dashboard --tail 20