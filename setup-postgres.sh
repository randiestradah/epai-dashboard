#!/bin/bash

# Setup PostgreSQL for EPAI System Database

echo "🗄️ Setting up PostgreSQL connection..."

# Add environment variables to apprunner.yaml
cat >> apprunner.yaml << 'EOF'
    - name: POSTGRES_HOST
      value: your-rds-endpoint.region.rds.amazonaws.com
    - name: POSTGRES_PORT
      value: 5432
    - name: POSTGRES_DB
      value: epai_system
    - name: POSTGRES_USER
      value: epai_admin
    - name: POSTGRES_PASSWORD
      value: your-secure-password
EOF

echo "✅ PostgreSQL configuration added to apprunner.yaml"
echo "📝 Update the values with your actual RDS credentials"
echo ""
echo "🚀 To initialize database, run:"
echo "psql -h your-rds-endpoint -U epai_admin -d epai_system -f src/lib/init-db.sql"