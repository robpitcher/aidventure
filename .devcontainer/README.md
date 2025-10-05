# Dev Container Configuration

This directory contains the VS Code Dev Container configuration for the Aidventure project.

## What is a Dev Container?

A development container (or dev container) is a running Docker container with a well-defined tool/runtime stack and its prerequisites. It allows you to use a container as a full-featured development environment.

## Features

This dev container includes:
- **Node.js 20 LTS** (as required by the project)
- **Git** and **GitHub CLI** for version control
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript
  - Vitest Explorer
  - GitHub Copilot

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Opening the Project in a Dev Container

1. Open VS Code
2. Open the Aidventure project folder
3. When prompted, click "Reopen in Container"
   - Or use the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and select "Dev Containers: Reopen in Container"
4. Wait for the container to build and start (first time will take a few minutes)
5. Once ready, the terminal will be inside the container and all npm modules will be available

### Running the Development Server

Once inside the container:

```bash
cd frontend
npm run dev
```

The Vite dev server will start on port 5173, which is automatically forwarded to your local machine.

## Benefits

- ✅ **Consistent environment** across all developers
- ✅ **All dependencies pre-installed** (no more "works on my machine")
- ✅ **Isolated from your local machine** (no version conflicts)
- ✅ **Auto-configured VS Code settings** and extensions
- ✅ **Hot reload** for React development

## Troubleshooting

### Container won't start
- Ensure Docker Desktop is running
- Try rebuilding the container: Command Palette → "Dev Containers: Rebuild Container"

### Port 5173 already in use
- Stop any local Vite servers running on your host machine
- Or change the port in `docker-compose.yml`

### npm modules still missing
- Rebuild the container to run `postCreateCommand` again
- Or manually run: `cd frontend && npm install`

## Customization

You can customize the dev container by editing:
- `.devcontainer/devcontainer.json` - VS Code settings and extensions
- `.devcontainer/Dockerfile` - Container base image and system packages
- `docker-compose.yml` - Service configuration and volumes
