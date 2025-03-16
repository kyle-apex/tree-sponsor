# Dev Container for Tree Sponsor Project

This directory contains configuration files for setting up a development container that isolates the project environment and restricts Cline's access to only the files within this project.

## What's Included

- Node.js 20.x environment (actively supported LTS version)
- MySQL 5.7 database
- Development tools and extensions
- Isolated environment for Cline

## Getting Started

### Prerequisites

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Install [Visual Studio Code](https://code.visualstudio.com/)
3. Install the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for VS Code

### Opening the Project in a Dev Container

1. Open the project folder in VS Code
2. Click on the green icon in the bottom-left corner of VS Code
3. Select "Reopen in Container" from the menu
4. Wait for the container to build and start (this may take a few minutes the first time)

VS Code will reload and connect to the development container. The terminal in VS Code will now run inside the container.

## How This Helps with Cline

When using this dev container:

1. Cline will only have access to files within the container
2. The container isolates the project from your host system
3. All development dependencies are contained within the container
4. The container provides a consistent environment for development

## Database Setup

The MySQL database is automatically set up with:

- Database name: `treefolksyp`
- Username: `root`
- Password: `treefolks`

After the container starts, you'll need to run:

```bash
npx prisma migrate deploy
```

This will apply all migrations to the database.

## Running the Application

To start the development server:

```bash
npm run server
```

The application will be available at http://localhost:3000

## Customizing the Container

You can modify the container configuration by editing:

- `devcontainer.json` - VS Code settings and extensions
- `Dockerfile` - Container environment and dependencies
- `docker-compose.yml` - Services and networking

After making changes, rebuild the container by clicking the green icon in the bottom-left corner and selecting "Rebuild Container".
