#!/bin/bash

# Initialize PostgreSQL database with EPAI schema

echo "🗄️ Initializing EPAI PostgreSQL database..."

# Database connection details
DB_HOST="epai-db.cj0wcmsam8bg.ap-southeast-3.rds.amazonaws.com"
DB_USER="postgres"
DB_PASSWORD="susude00!!"
DB_NAME="postgres"

# Set password for psql
export PGPASSWORD="$DB_PASSWORD"

echo "📋 Creating tables and inserting default data..."

# Execute the SQL initialization script
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f src/lib/init-db.sql

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully!"
    echo "🎯 Available endpoints:"
    echo "  - GET /api/system/models (AI models)"
    echo "  - GET /api/system/archetypes (Assistant templates)"
    echo "  - GET /api/system/features (Feature flags)"
else
    echo "❌ Database initialization failed!"
    exit 1
fi