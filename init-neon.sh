#!/bin/bash

# Initialize Neon PostgreSQL database with EPAI schema

echo "🗄️ Initializing EPAI Neon PostgreSQL database..."

DATABASE_URL="postgresql://neondb_owner:npg_Fx4JdrkfmbU9@ep-spring-breeze-a167x8af-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "📋 Creating tables and inserting default data..."

# Execute the SQL initialization script
psql "$DATABASE_URL" -f src/lib/init-db.sql

if [ $? -eq 0 ]; then
    echo "✅ Neon database initialized successfully!"
    echo "🎯 Available endpoints:"
    echo "  - GET /api/system/models (AI models)"
    echo "  - GET /api/system/archetypes (Assistant templates)"
    echo "  - GET /api/system/features (Feature flags)"
else
    echo "❌ Database initialization failed!"
    exit 1
fi