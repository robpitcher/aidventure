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
- Comprehensive test coverage
- Working demo component (`src/components/ChecklistDemo.tsx`)
- Docker development environment

**⏳ To Do:**

- User-facing UI pages
- AI service integration
- AI-assisted generation flow

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

The application follows a layered architecture:

1. **Types** (`src/types/`) - Complete TypeScript definitions
2. **Storage** (`src/storage/`) - LocalStorage with cross-tab sync
3. **State** (`src/state/`) - Zustand stores with CRUD operations
4. **Components** (`src/components/`) - React UI components

### Key Files

- `src/types/checklist.ts` - Complete data model
- `src/storage/checklistStorage.ts` - Storage implementation
- `src/state/checklistStore.ts` - Zustand store with CRUD
- `src/components/ChecklistDemo.tsx` - Working demo
- `STORAGE.md` - Storage documentation

## State Management

Use the Zustand store for all state operations:

```typescript
import { useChecklistStore } from './state/checklistStore';

const { checklists, createChecklist, addItem, updateItem, deleteItem, toggleItemComplete } =
  useChecklistStore();
```

**Never access the storage layer directly from components!**

## Testing

Comprehensive test coverage with Vitest + React Testing Library:

- Storage layer: `src/__tests__/checklistStorage.test.ts`
- State management: `src/__tests__/checklistStore.test.ts`
- Components: `src/__tests__/App.test.tsx`

Run tests: `npm test` or `npm run test:ui`

## Documentation

- [STORAGE.md](./STORAGE.md) - Storage implementation details
- [../PRD.md](../PRD.md) - Product requirements
- [../QUICKSTART.md](../QUICKSTART.md) - Quick start guide

## Tech Stack

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
