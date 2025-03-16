#!/bin/bash

echo "Rebuilding devcontainer with fixed permissions..."

# Stop any running containers
echo "Stopping running containers..."
docker-compose -f .devcontainer/docker-compose.yml down

# Remove the node_modules volume to ensure clean rebuild
echo "Removing node_modules volume..."
docker volume rm $(docker volume ls -q | grep node_modules) 2>/dev/null || true

# Rebuild the container
echo "Rebuilding container..."
docker-compose -f .devcontainer/docker-compose.yml build --no-cache app

echo "Done! Now you can reopen your project in the devcontainer."
echo "The permission issues should be resolved."
