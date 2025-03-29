#!/bin/bash
set -e

# Check if Prisma dependencies are installed
echo "Checking for Prisma dependencies..."
if [ ! -d "/workspace/node_modules/@prisma" ]; then
  echo "Prisma dependencies not found. Ensuring npm install has completed..."
  
  # Check if package.json exists
  if [ ! -f "/workspace/package.json" ]; then
    echo "Error: package.json not found in /workspace"
    exit 1
  fi
  
  # Run npm install if needed
  if [ ! -d "/workspace/node_modules" ] || [ ! -d "/workspace/node_modules/@prisma" ]; then
    echo "Running npm install to ensure Prisma is available..."
    cd /workspace
    npm install
  fi
  
  # Verify Prisma is now installed
  if [ ! -d "/workspace/node_modules/@prisma" ]; then
    echo "Error: Failed to install Prisma dependencies"
    exit 1
  fi
fi

# Wait for MariaDB to be ready
echo "Waiting for MariaDB to be ready..."
until mysql -h db -P 3309 -u root -ptreefolks -e "SELECT 1"; do
  echo "Waiting for database connection..."
  sleep 2
done

echo "MariaDB is ready!"

# Check if the database exists
if mysql -h db -P 3309 -u root -ptreefolks -e "USE treefolksyp"; then
  echo "Database treefolksyp already exists."
else
  echo "Creating database treefolksyp..."
  mysql -h db -P 3309 -u root -ptreefolks -e "CREATE DATABASE treefolksyp;"
  echo "Database created!"
fi

# Run Prisma migrations
echo "Running Prisma migrations..."
cd /workspace
npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Verify database has tables
echo "Verifying database setup..."
TABLE_COUNT=$(mysql -h db -P 3309 -u root -ptreefolks -e "USE treefolksyp; SHOW TABLES;" | wc -l)

if [ $TABLE_COUNT -le 1 ]; then
  echo "Warning: Database appears to be empty. Tables may not have been created properly."
  echo "This could indicate an issue with the Prisma migrations."
  echo "Please check the Prisma schema and migration files."
else
  echo "Database verification successful. Found $(($TABLE_COUNT-1)) tables."
fi

echo "Database initialization complete!"
