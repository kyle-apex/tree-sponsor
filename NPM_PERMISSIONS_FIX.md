# Fixing npm Permission Issues in Dev Container

This document explains the changes made to fix the npm permission issues in the dev container.

## The Problem

The error you encountered was:

```
npm error code EACCES
npm error syscall mkdir
npm error path /workspace/node_modules/@ampproject
npm error errno -13
npm error Error: EACCES: permission denied, mkdir '/workspace/node_modules/@ampproject'
```

This occurred because the Docker volume for `node_modules` was owned by the root user, but the container was running as the `node` user, causing permission denied errors during npm install.

## The Solution

The following changes were made to fix the issue:

1. Modified `.devcontainer/docker-compose.yml`:
   - Changed the container to start as `root` user instead of `node`
   - Added a command that ensures proper permissions on the `node_modules` directory before switching to the `node` user

2. Updated `.devcontainer/devcontainer.json`:
   - Modified the `postCreateCommand` to use `chown` directly (without sudo) and run npm install as the node user

3. Updated `rebuild-devcontainer.sh`:
   - Updated to use modern `docker compose` syntax instead of `docker-compose`
   - Added a step to start the container after rebuilding
   - Added helpful messages about next steps

## How to Fix

To fix the npm permission issues, run the following command from your host machine (not inside the container):

```bash
chmod +x rebuild-devcontainer.sh && ./rebuild-devcontainer.sh
```

This script will:
1. Stop any running containers
2. Remove the node_modules volume
3. Rebuild the container with the new configuration
4. Start the container

After the script completes, you can reopen your project in the dev container and run `npm install` again. The permission issues should be resolved.

## If Issues Persist

If you still encounter permission issues after rebuilding:

1. Open a terminal in the dev container
2. Run: `ls -la /workspace/node_modules` to check permissions
3. If needed, ask your system administrator for help with Docker volume permissions
