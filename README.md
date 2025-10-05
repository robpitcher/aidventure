# Aidventure

AI Adventure Racing Assistant - An MVP web application that helps adventure racers generate and manage packing checklists, assisted by AI (Azure OpenAI).

## Overview

Aidventure is a React-based web application designed to help adventure racers create, refine, and manage packing checklists for races. Users can manually add checklist items or use AI assistance to generate tailored packing checklists based on race parameters like duration, disciplines, location, weather, and team size.

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (for shared state across 3+ components)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier
- **Package Manager**: npm
- **Runtime**: Node.js 20 LTS

## Project Structure

```
aidventure/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── ai/             # AI service and prompt building
│   │   ├── checklist/      # Checklist-specific components and logic
│   │   ├── state/          # Global state management (Zustand)
│   │   ├── types/          # TypeScript type definitions
│   │   └── __tests__/      # Test files
│   ├── public/             # Static assets
│   └── package.json
├── PRD.md                  # Product Requirements Document
└── README.md               # This file
```

## Prerequisites

- **Docker** (recommended): Docker Desktop or Docker Engine + Docker Compose
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Or install Docker Engine and Docker Compose separately

- **Without Docker**: Node.js >= 20.0.0 and npm

## Getting Started

### Option 1: Using Docker (Recommended)

Docker provides a consistent development environment with hot reload support.

#### 1. Clone the repository

```bash
git clone https://github.com/robpitcher/aidventure.git
cd aidventure
```

#### 2. Create environment file (optional)

```bash
cp .env.example .env
```

#### 3. Start the application

```bash
docker compose up
```

The application will be available at `http://localhost:5173`

#### 4. Stop the application

```bash
docker compose down
```

#### 5. Rebuild after changes to dependencies

```bash
docker compose up --build
```

### Option 2: Without Docker

#### 1. Clone the repository

```bash
git clone https://github.com/robpitcher/aidventure.git
cd aidventure
```

#### 2. Install dependencies

```bash
cd frontend
npm install
```

#### 3. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### 4. Build for production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

#### 5. Preview production build

```bash
npm run preview
```

## Available Scripts

### With Docker

- `docker compose up` - Start the development environment
- `docker compose up --build` - Rebuild and start the environment
- `docker compose down` - Stop the environment
- `docker compose logs -f frontend` - View frontend logs

### Without Docker

In the `frontend/` directory, you can run:

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI

## Development Guidelines

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for consistent formatting
- Tailwind CSS for styling

### State Management

Use Zustand when state needs to be:
- Shared across 3+ components
- Persisted to localStorage
- Otherwise, prefer local component state

### Testing

- Unit tests: Prompt builder, schema validator
- Component tests: Checklist CRUD interactions
- Run tests before committing: `npm test`

### Folder Organization

- `components/` - Reusable UI components
- `pages/` - Page-level route components
- `ai/` - AI service, prompt building
- `checklist/` - Checklist business logic
- `state/` - Global state stores
- `types/` - TypeScript interfaces and types

## Data Model

See `frontend/src/types/checklist.ts` for the complete data model. Key types:

- `Checklist` - Main checklist entity
- `Item` - Individual checklist item
- `AIGenerationParams` - Parameters for AI generation
- `CategoryResponse` - AI response structure

## Docker Development

### Docker Architecture

The project uses Docker and Docker Compose for a consistent development environment:

- **Multi-stage Dockerfile**: Optimized for both development and production
- **Hot Reload**: File changes are automatically reflected in the running container
- **Volume Mounts**: Source code is mounted for live updates
- **Network Isolation**: Services communicate via dedicated Docker network

### Docker Commands

```bash
# Start development environment
docker compose up

# Start in detached mode (background)
docker compose up -d

# View logs
docker compose logs -f frontend

# Rebuild containers (after dependency changes)
docker compose up --build

# Stop containers
docker compose down

# Remove containers and volumes
docker compose down -v

# Execute commands in running container
docker compose exec frontend npm run lint
docker compose exec frontend npm test
```

### Production Build with Docker

```bash
# Build production image
docker build -t aidventure-frontend:latest --target production ./frontend

# Run production container
docker run -p 8080:80 aidventure-frontend:latest
```

## Troubleshooting

### Docker Issues

**"Exit handler never called!" npm warning during build:**
- This is a [known npm bug](https://github.com/npm/cli/issues/4769) in Docker environments
- The warning is benign and doesn't affect container functionality
- Dependencies are still installed correctly
- You can safely ignore this warning

**Hot reload not working:**
- The Vite config uses polling to detect file changes in Docker
- If changes aren't reflected, restart the container: `docker compose restart frontend`

**Port already in use:**
- Stop the conflicting service or change the port in `docker-compose.yml`
- Check running containers: `docker ps`

**Changes to package.json not reflected:**
- Rebuild the container: `docker compose up --build`
- Or rebuild specific service: `docker compose build frontend`

**Permission errors on Linux:**
- Files created by Docker may be owned by root
- Fix with: `sudo chown -R $USER:$USER .`

**Container fails to start:**
- Check logs: `docker compose logs frontend`
- Ensure Docker Desktop/Engine is running
- Verify port 5173 is not in use: `lsof -i :5173` (macOS/Linux) or `netstat -ano | findstr :5173` (Windows)

**Cannot connect to container:**
- Ensure you're accessing `http://localhost:5173` (not `http://0.0.0.0:5173`)
- Check container is running: `docker compose ps`
- Verify firewall settings

### General Issues

**Build errors:**
- Clear build cache: `rm -rf frontend/dist frontend/node_modules`
- Reinstall dependencies: `cd frontend && npm install`

**Test failures:**
- Ensure all dependencies are installed: `npm install`
- Clear test cache: `npm test -- --clearCache`

**Linting errors:**
- Auto-fix: `npm run format`
- Check specific issues: `npm run lint`

## Future Enhancements

- Backend proxy for secure Azure OpenAI key usage
- CI/CD with GitHub Actions
- User authentication
- Cloud deployment (Azure)
- Weather API integration
- Gear optimization recommendations

## Contributing

This is an MVP project. When implementing features:

1. Follow the existing folder structure
2. Add TypeScript types in `types/` directory
3. Write tests for new functionality
4. Run lint and format before committing
5. Update documentation as needed

## License

MIT License - see LICENSE file for details

## Documentation

- [PRD.md](./PRD.md) - Detailed product requirements and specifications
- [Custom Instructions](./.github/copilot-instructions.md) - Development guidelines for Copilot

## Support

For questions or issues, please open an issue on GitHub.

