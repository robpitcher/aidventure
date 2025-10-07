# Aidventure

AI Adventure Racing Assistant - An MVP web application that helps adventure racers generate and manage packing checklists, assisted by AI (Azure OpenAI).

## Overview

Aidventure is a React-based web application designed to help adventure racers create, refine, and manage packing checklists for races. Users can manually add checklist items or use AI assistance to generate tailored packing checklists based on race parameters like duration, disciplines, location, weather, and team size.

### Current Implementation Status

**✅ Implemented:**

- Complete type system for checklists and items
- LocalStorage persistence layer with cross-tab synchronization
- Zustand state management with full CRUD operations
- Checklist UI (category grouping, add/edit/delete items, progress, bulk actions) – see `frontend/CHECKLIST_UI.md`
- Comprehensive test coverage (storage + state management; UI tests upcoming)
- Docker development environment with hot reload
- Complete linting and formatting setup

**⏳ In Progress / Planned:**

- AI service integration (Azure OpenAI) + backend proxy (secure key usage)
- AI-assisted checklist generation & refinement flow
- Additional Checklist UI interaction & accessibility tests

## Tech Stack

- **Frontend**: React 19 + Vite 7 + TypeScript 5.9
- **Styling**: Tailwind CSS 3.4 (with custom outdoor racing theme)
- **State Management**: Zustand 5.0
- **Storage**: localStorage with abstraction layer (future-ready for IndexedDB)
- **Testing**: Vitest 3.2 + React Testing Library + @testing-library/jest-dom
- **Linting**: ESLint 9 (flat config) + Prettier 3.6
- **Package Manager**: npm
- **Runtime**: Node.js >= 20.0.0
- **Containerization**: Docker + Docker Compose

## Project Structure

```
aidventure/
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (Checklist UI implemented)
│   │   │   ├── checklist/  # Production Checklist UI components
│   │   │   └── ChecklistDemo.tsx (legacy demo)
│   │   ├── ai/             # AI service & prompt building (to be created)
│   │   ├── state/          # Global state management (Zustand)
│   │   │   └── checklistStore.ts (complete CRUD operations)
│   │   ├── storage/        # Persistence layer
│   │   │   └── checklistStorage.ts (localStorage implementation)
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── checklist.ts (complete data model)
│   │   └── __tests__/      # Test files
│   │       ├── App.test.tsx
│   │       ├── checklistStorage.test.ts
│   │       ├── checklistStore.test.ts
│   │       └── setup.ts
│   ├── public/             # Static assets
│   ├── Dockerfile          # Multi-stage Docker build
│   ├── STORAGE.md          # Storage implementation docs
│   └── package.json
├── docker-compose.yml      # Docker Compose configuration
├── PRD.md                  # Product Requirements Document
├── QUICKSTART.md          # Developer onboarding guide
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

The application uses Zustand for state management with a complete implementation in `src/state/checklistStore.ts`:

**Implemented Store Actions:**

- `loadChecklists()` - Load all checklists from storage
- `createChecklist(name)` - Create a new checklist
- `updateChecklist(checklist)` - Update an existing checklist
- `deleteChecklist(id)` - Delete a checklist
- `setCurrentChecklist(id)` - Set the active checklist
- `addItem(checklistId, item)` - Add an item to a checklist
- `updateItem(checklistId, itemId, updates)` - Update a checklist item
- `deleteItem(checklistId, itemId)` - Remove an item
- `toggleItemComplete(checklistId, itemId)` - Toggle item completion status

**Features:**

- Automatic cross-tab synchronization
- Error handling and loading states
- Integration with localStorage persistence layer

Use the store for all state operations. Do not access the storage layer directly from components.

### Testing

The project has comprehensive test coverage for core functionality:

**Implemented Tests:**

- Storage layer: CRUD operations, timestamps, cross-tab sync, error handling
- State management: All Zustand store actions and state updates
- Component: Basic App component test

**Test Commands:**

- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI
- Run tests before committing

**Testing Stack:**

- Vitest 3.2 with jsdom environment
- React Testing Library for component testing
- @testing-library/jest-dom for enhanced matchers
- @testing-library/user-event for user interaction testing

See `src/__tests__/` for examples and `STORAGE.md` for storage implementation details.

### Folder Organization

- `components/checklist/` - Production Checklist UI (see `CHECKLIST_UI.md`)
- `components/ChecklistDemo.tsx` - Legacy demo component (optional)
- `ai/` - (Planned) AI service & prompt utilities
- `state/` - Global state stores (Zustand)
- `storage/` - Persistence layer abstraction
- `types/` - TypeScript interfaces and domain types

## Data Model

The complete data model is defined in `frontend/src/types/checklist.ts`. Key types:

- `Checklist` - Main checklist entity with items and metadata
- `Item` - Individual checklist item with category, notes, quantity, priority
- `AIGenerationParams` - Parameters for AI-assisted generation
- `AIChecklistResponse` - AI response structure
- `CategoryResponse` - Category with items from AI
- `ItemResponse` - Individual item from AI response
- `GeneratedChecklistMeta` - Metadata for AI-generated checklists
- `ChatSession` - Chat history for iterative refinement

**Storage Implementation:**

The storage layer (`src/storage/checklistStorage.ts`) provides:

- `ChecklistStorageAPI` interface for abstraction
- `LocalStorageChecklistStorage` implementation
- Helper functions: `createEmptyChecklist()`, `generateChecklistId()`, `generateItemId()`
- Automatic timestamp management
- Cross-tab synchronization
- Versioning for future migrations

See `STORAGE.md` for detailed documentation on the storage system.

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

**Planned Features:**

- AI service integration with Azure OpenAI (secure backend proxy)
- AI-assisted checklist generation with structured Q&A & iterative refinement
- Zod schema validation + robust error handling for AI responses
- Additional interaction & accessibility test coverage for Checklist UI

**Potential Future Additions:**

- CI/CD with GitHub Actions
- User authentication and cloud sync
- Cloud deployment (Azure)
- Weather API integration
- Gear optimization recommendations
- Export to PDF/CSV
- Team-specific pack allocation
- Weight tracking

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
- [QUICKSTART.md](./QUICKSTART.md) - Quick developer onboarding guide
- [STORAGE.md](./frontend/STORAGE.md) - Storage and state management documentation
- [Checklist UI Guide](./frontend/CHECKLIST_UI.md) - Detailed UI behaviors & UX patterns
- [Copilot Instructions](./.github/copilot-instructions.md) - Development guidelines for Copilot agents

## Support

For questions or issues, please open an issue on GitHub.
