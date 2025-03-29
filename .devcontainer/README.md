# Development Container Setup

This directory contains configuration files for the VS Code Development Container. The dev container provides a consistent development environment with all necessary dependencies pre-installed.

## Setup Process

When the dev container is created, the following steps are automatically performed:

1. The container is built using the Dockerfile in this directory
2. Node.js dependencies are installed via `npm install`
3. The MariaDB database is initialized
4. Prisma migrations are applied to create the database schema
5. The Prisma client is generated

## Troubleshooting

### Missing Database Tables

If you encounter errors like "The table `users` does not exist", it means the database initialization process didn't complete successfully. Here's how to fix it:

1. Open a terminal in VS Code and run:

   ```bash
   chmod +x .devcontainer/init-db.sh && .devcontainer/init-db.sh
   ```

2. This will:
   - Wait for the MariaDB database to be ready
   - Create the database if it doesn't exist
   - Run all Prisma migrations to create the tables
   - Generate the Prisma client

### Database Connection Issues

If you're having trouble connecting to the database:

1. Ensure the database container is running:

   ```bash
   docker ps | grep db
   ```

2. Check if you can connect to the database directly:

   ```bash
   mysql -h db -P 3309 -u root -ptreefolks -e "SHOW DATABASES;"
   ```

3. Verify the DATABASE_URL environment variable is set correctly:
   ```bash
   echo $DATABASE_URL
   ```
   It should be: `mysql://root:treefolks@db:3309/treefolksyp`

### Rebuilding the Dev Container

If you need to completely rebuild the dev container:

1. Run the rebuild script:

   ```bash
   ./rebuild-devcontainer.sh
   ```

2. After rebuilding, reopen the project in VS Code and select "Reopen in Container" when prompted.

## Manual Database Setup

If you need to manually set up the database:

1. Ensure npm dependencies are installed:

   ```bash
   npm install
   ```

2. Run Prisma migrations:

   ```bash
   npx prisma migrate deploy
   ```

3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Testing Database Connection

You can test the database connection with:

```bash
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); async function main() { try { const userCount = await prisma.user.count(); console.log('User count:', userCount); } catch (error) { console.error('Error:', error.message); } finally { await prisma.\$disconnect(); } } main()"
```
