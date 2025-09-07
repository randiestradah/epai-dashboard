#!/bin/bash

# Create EPAI database in PostgreSQL RDS

echo "🗄️ Creating EPAI database..."

DB_HOST="epai-db.cj0wcmsam8bg.ap-southeast-3.rds.amazonaws.com"
DB_USER="postgres"
DB_PASSWORD="susude00!!"

export PGPASSWORD="$DB_PASSWORD"

echo "📋 Creating database 'epai_system'..."

# Create database
psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "CREATE DATABASE epai_system;"

if [ $? -eq 0 ]; then
    echo "✅ Database 'epai_system' created successfully!"
    echo "🚀 Now run: ./init-postgres.sh"
else
    echo "❌ Database creation failed (might already exist)"
fi