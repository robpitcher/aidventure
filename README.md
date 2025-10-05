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

- Node.js >= 20.0.0
- npm (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/robpitcher/aidventure.git
cd aidventure
```

### 2. Install dependencies

```bash
cd frontend
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### 5. Preview production build

```bash
npm run preview
```

## Available Scripts

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

## Future Enhancements

- Backend proxy for secure Azure OpenAI key usage
- Docker containerization
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

