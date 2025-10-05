# Quick Start Guide

## Initial Setup

1. **Prerequisites**: Node.js >= 20.0.0

2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:5173

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is formatted |
| `npm run test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with UI |

## Project Conventions

### State Management
- **Local state**: Use React's `useState` for component-specific state
- **Zustand**: Use when state needs to be shared across 3+ components or persisted

### File Organization
- `components/` - Reusable UI components (buttons, inputs, cards)
- `pages/` - Page-level components (routes)
- `ai/` - AI service integration and prompt building
- `checklist/` - Checklist-specific business logic
- `state/` - Zustand stores for global state
- `types/` - TypeScript type definitions
- `__tests__/` - Test files (co-located with source)

### Code Style
- TypeScript for all new files
- Run `npm run lint` before committing
- Run `npm run format` to auto-fix formatting
- Follow existing patterns in the codebase

### Testing
- Write tests for new components and logic
- Use Vitest + React Testing Library
- See `src/__tests__/App.test.tsx` for examples

## Type Definitions

Key types are defined in `src/types/checklist.ts`:
- `Checklist` - Main checklist structure
- `Item` - Individual checklist item
- `AIGenerationParams` - AI generation parameters
- `CategoryResponse` - AI response format

## Next Steps

1. Implement core components in `components/`
2. Create checklist page in `pages/`
3. Add AI service integration in `ai/`
4. Set up state management in `state/`

See PRD.md for complete feature specifications.
