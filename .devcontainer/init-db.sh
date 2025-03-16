#!/bin/bash
set -e

# Wait for MariaDB to be ready
echo "Waiting for MariaDB to be ready..."
until mysql -h db -u root -ptreefolks -e "SELECT 1"; do
  sleep 1
done

echo "MariaDB is ready!"

# Check if the database exists
if mysql -h db -u root -ptreefolks -e "USE treefolksyp"; then
  echo "Database treefolksyp already exists."
else
  echo "Creating database treefolksyp..."
  mysql -h db -u root -ptreefolks -e "CREATE DATABASE treefolksyp;"
  echo "Database created!"
fi

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Database initialization complete!"
