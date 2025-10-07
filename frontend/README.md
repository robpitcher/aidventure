# Aidventure Frontend

This is the frontend application for Aidventure, an AI-assisted adventure racing packing checklist tool.

## Implementation Status

**✅ Complete:**

- React 19 + Vite 7 + TypeScript 5.9 setup
- Tailwind CSS 3.4 with custom outdoor racing theme
- ESLint 9 (flat config) + Prettier 3.6
- Vitest 3.2 testing infrastructure
- Complete type system (`src/types/checklist.ts`)
- LocalStorage persistence layer (`src/storage/checklistStorage.ts`)
- Zustand state management (`src/state/checklistStore.ts`)
- Production Checklist UI (category grouping, CRUD, progress, bulk actions) – see `CHECKLIST_UI.md`
- Docker development environment
- Core test coverage (storage + state); UI interaction tests upcoming

**⏳ In Progress / Planned:**

- AI service integration (Azure OpenAI) + backend proxy
- AI-assisted checklist generation & refinement workflow
- Zod validation for AI responses
- Additional interaction & accessibility tests

## Quick Start

### With Docker (Recommended)

From the root directory:

```bash
docker compose up
```

Visit http://localhost:5173

### Without Docker

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality with ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI

## Architecture

Layered structure:

1. **Types** (`src/types/`) – Domain model & AI-related types
2. **Storage** (`src/storage/`) – LocalStorage abstraction + cross-tab sync
3. **State** (`src/state/`) – Zustand store (CRUD + item operations)
4. **UI Components** (`src/components/`) – Production Checklist UI in `checklist/`
5. **AI** (`src/ai/`) – (Planned) prompt building & service wrapper

### Key Paths

- `types/checklist.ts` – Domain types
- `storage/checklistStorage.ts` – Persistence implementation
- `state/checklistStore.ts` – Global store
- `components/checklist/` – Production Checklist UI
- `components/ChecklistDemo.tsx` – Legacy demo component
- `CHECKLIST_UI.md` – Detailed UI behavior & UX notes
- `STORAGE.md` – Storage & persistence documentation

## State Management

Use the Zustand store for all state operations:

```typescript
import { useChecklistStore } from './state/checklistStore';

const { checklists, createChecklist, addItem, updateItem, deleteItem, toggleItemComplete } =
  useChecklistStore();
```

**Never access the storage layer directly from components!**

## Testing

Core test coverage (Vitest + React Testing Library):

- Storage layer: `src/__tests__/checklistStorage.test.ts`
- State management: `src/__tests__/checklistStore.test.ts`
- Basic App mounting: `src/__tests__/App.test.tsx`

Upcoming:

- Checklist UI interaction & accessibility tests

Run tests: `npm test` (watch) or `npm run test:ui` (UI runner)

## Documentation

- `CHECKLIST_UI.md` – UI behavior guide
- `STORAGE.md` – Storage implementation details
- `../PRD.md` – Product requirements
- `../QUICKSTART.md` – Quick start guide

## Tech Stack Summary

React 19, Vite 7, TypeScript 5.9, Tailwind CSS 3.4, Zustand 5, Vitest 3.2, ESLint 9 (flat), Prettier 3.6.

AI integration (Azure OpenAI) will be added behind a backend proxy – never expose keys client-side.
