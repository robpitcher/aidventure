# Copilot Coding Agent Onboarding – Aidventure

**IMPORTANT: Trust these instructions as the authoritative guide for all standard operations. Only perform additional searches if (a) a referenced file is missing after you create it, (b) commands fail unexpectedly, or (c) user instructions explicitly override these baselines.**

This repository contains a React + Vite + TypeScript application with Tailwind CSS, ESLint, Prettier, and Vitest configured. The frontend structure includes complete type definitions, state management, local storage persistence, and comprehensive testing infrastructure.

## 1. Repository Summary

Aidventure is an MVP web application that helps adventure racers generate and manage packing checklists, optionally assisted by AI (Azure AI Foundry / Azure OpenAI).

**Current state**: Core infrastructure implemented with working storage layer, state management, and demo component.

**Implemented features**:

- ✅ Complete type definitions for checklists and items
- ✅ LocalStorage persistence layer with versioning and cross-tab sync
- ✅ Zustand state management with full CRUD operations
- ✅ Comprehensive test coverage (storage + store)
- ✅ Working demo component showing storage in action
- ✅ Docker setup for consistent development

**Pending implementation**:

- ⏳ AI service integration (Azure OpenAI)
- ⏳ User-facing UI pages (checklist view, AI assist modal)
- ⏳ AI prompt builder and response handler

Current stack (implemented):

- Frontend: React 19 + Vite 7 (Node.js >= 20.0.0)
- Styling: Tailwind CSS 3.4
- State: Zustand 5.0 for global state management
- Storage: localStorage with abstraction layer for future IndexedDB migration
- Testing: Vitest 3.2 + React Testing Library + @testing-library/jest-dom
- Lint/Format: ESLint 9 (flat config) + Prettier 3.6
- Package Manager: npm (standardized - avoid mixing with pnpm)
- TypeScript: 5.9 with strict configuration
- Containerization: Docker + Docker Compose (implemented)
- (Future) Backend proxy: Node (Express/Fastify) or Python FastAPI for secure AI key usage
- AI: Azure OpenAI (GPT-4o / GPT-4 Turbo) - to be integrated

Repo size: Small. Complete testing infrastructure with working storage and state layers.

## 2. Layout & Key Files

Root files:

- `README.md` – project overview and getting started guide
- `PRD.md` – detailed product requirements (use this for feature scope & data model)
- `QUICKSTART.md` – developer onboarding guide with commands and conventions
- `LICENSE` – MIT
- `.github/copilot-instructions.md` – (this file)
- `.gitattributes` – line ending normalization and file type specifications
- `docker-compose.yml` – Docker Compose configuration for development

Current structure:

```
frontend/
  src/
    components/
      ChecklistDemo.tsx  (working demo component)
    pages/               (empty - to be created)
    ai/                  (empty - to be created)
    checklist/           (empty - to be created)
    state/
      checklistStore.ts  (complete Zustand store with CRUD)
    storage/
      checklistStorage.ts (complete localStorage layer)
    types/
      checklist.ts       (complete type definitions)
    assets/
      react.svg
    __tests__/
      App.test.tsx            (example test)
      checklistStorage.test.ts (comprehensive storage tests)
      checklistStore.test.ts   (comprehensive store tests)
      setup.ts                 (Vitest setup)
    App.tsx              (uses ChecklistDemo)
    main.tsx             (React entry point)
    index.css            (Tailwind directives)
  public/
    vite.svg
  index.html
  package.json           (all dependencies installed)
  tsconfig.json          (base config)
  tsconfig.app.json      (app-specific config)
  tsconfig.node.json     (node-specific config)
  vite.config.ts         (Vitest configured)
  tailwind.config.js     (configured with custom theme)
  postcss.config.js
  eslint.config.js       (flat config with React + TypeScript + Prettier)
  Dockerfile             (multi-stage build for production)
  README.md              (Vite template info)
  STORAGE.md             (storage implementation documentation)
backend/ (not yet created - add when AI proxy needed)
```

## 3. Build & Run (Implemented)

The frontend infrastructure is complete with storage, state management, and testing fully implemented. Standard workflow:

1. **Install dependencies** (already done, but run after pulling):

   ```bash
   cd frontend
   npm install
   ```

2. **Development server**:

   ```bash
   npm run dev
   ```

   Opens at http://localhost:5173 with hot reload

3. **Available scripts** (see `frontend/package.json`):

   - `npm run dev` – Start Vite dev server
   - `npm run build` – TypeScript compile + production build
   - `npm run preview` – Preview production build
   - `npm run lint` – ESLint check
   - `npm run format` – Auto-format with Prettier
   - `npm run format:check` – Check formatting
   - `npm run test` – Run Vitest in watch mode
   - `npm run test:ui` – Run tests with UI

4. **Key configurations**:

   - ESLint: `eslint.config.js` (flat config with TypeScript + React + Prettier integration)
   - TypeScript: Strict mode enabled, `tsconfig.json` + app/node splits
   - Vitest: Configured in `vite.config.ts` with jsdom, globals, setup file
   - Tailwind: Custom theme with outdoor racing color palette (primary colors defined)

5. **Adding new dependencies**:

   ```bash
   cd frontend
   npm install <package>        # production
   npm install -D <package>     # dev dependency
   ```

6. **Docker** (implemented):
   Development container with hot reload:
   ```bash
   docker compose up          # Start dev server
   docker compose down        # Stop container
   docker compose up --build  # Rebuild after dependency changes
   ```
   See `docker-compose.yml` and `frontend/Dockerfile` for configuration.

## 4. Testing & Validation (Implemented)

Testing infrastructure is complete with comprehensive test coverage for storage and state layers.

**Test setup** (fully configured):

- Framework: Vitest 3.2 with jsdom environment
- Libraries: React Testing Library + @testing-library/jest-dom + user-event
- Setup file: `src/__tests__/setup.ts` (imports jest-dom matchers)
- Example tests:
  - `src/__tests__/App.test.tsx` (basic component test)
  - `src/__tests__/checklistStorage.test.ts` (comprehensive storage layer tests)
  - `src/__tests__/checklistStore.test.ts` (comprehensive Zustand store tests)

**Current test coverage**:

- ✅ Storage layer: CRUD operations, timestamps, cross-tab sync, error handling
- ✅ State management: Zustand store with all actions (create, update, delete, items)
- ✅ Component: Basic App component test
- ⏳ Demo component: ChecklistDemo (to be added)

**Testing workflow**:

1. Write tests co-located with source (or in `__tests__/`)
2. Run `npm run test` for watch mode
3. Run `npm run test:ui` for visual test interface
4. Always run tests before opening PRs

**Coverage priorities for future features**:

- Unit: AI prompt builder (`ai/buildPrompt.ts`), schema validator
- Component: Checklist CRUD (ChecklistPage, ItemRow) via React Testing Library
- Integration: End-to-end checklist workflows
- Accessibility: Use `@testing-library/jest-dom`; optionally add `axe-core` in a dedicated test

**Pre-commit checklist**:

- `npm run lint` (ESLint passes)
- `npm run format:check` (Prettier formatted)
- `npm test` (all tests pass)
- `npm run build` (TypeScript compiles, no errors)

## 5. Checklist & Data Model Guidance

Reference `PRD.md` Section 8 for data model. TypeScript interfaces are fully implemented in `src/types/checklist.ts`:

**Core types** (fully defined):

- `Checklist` – Main checklist structure with items and metadata
- `Item` – Individual checklist item with category, notes, quantity, priority
- `AIGenerationParams` – Parameters for AI generation (duration, disciplines, etc.)
- `AIChecklistResponse` – AI response structure with categories
- `CategoryResponse` – Category with items
- `ItemResponse` – Individual item from AI
- `GeneratedChecklistMeta` – Metadata for AI-generated checklists
- `ChatSession` – Chat history for iterative refinement

**Storage layer** (fully implemented in `src/storage/checklistStorage.ts`):

- `ChecklistStorageAPI` – Abstract storage interface
- `LocalStorageChecklistStorage` – localStorage implementation
- Helper functions: `createEmptyChecklist()`, `generateChecklistId()`, `generateItemId()`
- Cross-tab synchronization via storage events
- Versioning support for future migrations

**State management** (fully implemented in `src/state/checklistStore.ts`):

- Zustand store with complete CRUD operations
- Actions: `loadChecklists()`, `createChecklist()`, `updateChecklist()`, `deleteChecklist()`
- Item operations: `addItem()`, `updateItem()`, `deleteItem()`, `toggleItemComplete()`
- Cross-tab sync integration
- Error handling and loading states

When implementing features:

1. Import types from `src/types/checklist.ts`
2. Use `checklistStore` for state management
3. Storage operations are abstracted - use store actions instead of direct storage calls
4. Keep AI JSON schema synchronized with these types
5. When adjusting fields, update both the prompt template and validators
6. IDs are generated via `crypto.randomUUID()` in storage layer

## 6. AI Integration Guidance

Abstract model interaction in `src/ai/aiService.ts` (to be created):

- `buildPrompt(params)` – pure function, unit test it.
- `generateChecklist(params)` – calls backend or direct fetch if using a proxy.
  Return structured JSON; validate with Zod (`npm i zod` when needed). On parsing failure, surface raw text per PRD error handling.

When integrating with the existing state layer:

1. AI responses should be parsed into `AIChecklistResponse` type
2. Use `createChecklist()` from store to create new checklist
3. Use `addItem()` to populate items from AI response
4. Consider adding `aiMetadata?: GeneratedChecklistMeta` to track AI-generated checklists

Never expose Azure keys client-side. If no backend yet, mock responses until backend layer is introduced.

## 7. Linting & Formatting (Implemented)

ESLint 9 flat config is configured in `eslint.config.js` with:

- TypeScript ESLint
- React Hooks plugin
- React Refresh plugin
- Prettier integration (no conflicts)

**Usage**:

- `npm run lint` – Check for issues
- `npm run format` – Auto-format with Prettier
- `npm run format:check` – Verify formatting

Always run `npm run lint` and `npm run format:check` before PRs. Consider adding Husky pre-commit hooks later.

## 8. CI / GitHub Actions (Future)

When adding workflows, include at minimum:

- Node 20 setup
- Cache dependencies
- Steps: install → lint → type-check → test → build
  Name workflow file `.github/workflows/ci.yml`. The coding agent should replicate these locally before pushing.

## 9. Common Pitfalls to Avoid

- Do NOT commit `.env` or Azure keys.
- Do NOT put AI prompt logic scattered across components; keep centralized service.
- Avoid adding backend prematurely; mock first, add proxy only when required.
- Keep checklist item IDs stable (use `crypto.randomUUID()` via storage layer helpers).
- Always update schema & validator when changing checklist structure.
- Do NOT call storage layer directly from components - use Zustand store actions instead.
- Remember that storage operations are async - await them properly.
- Cross-tab sync is automatic - don't manually trigger storage events.

## 10. Contribution Pattern for the Agent

When implementing a new feature:

1. Create required folders if absent (see structure above).
2. Add minimal type definitions first.
3. Write a small failing test (if applicable) to guide implementation.
4. Implement component/service logic.
5. Add or update exports via an index barrel only when it improves clarity (avoid premature barrels).
6. Run: install (if new deps) → lint → type-check → test → build.
7. Update README with any new run steps if they differ from this file.

## 11. File Creation Priorities

Frontend scaffold is complete. When adding features, create in this order:

1. Type definitions in `src/types/` (if needed beyond checklist.ts)
2. State stores in `src/state/` (Zustand stores for shared state)
3. Reusable components in `src/components/`
4. Page components in `src/pages/`
5. AI service logic in `src/ai/aiService.ts`
6. Business logic in `src/checklist/`
7. Tests alongside implementation in `__tests__/` or co-located

Core infrastructure files already exist:

- `package.json`, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`
- `index.html`, `src/main.tsx`, `src/App.tsx`
- `src/types/checklist.ts` (complete type definitions)
- `src/storage/checklistStorage.ts` (complete localStorage implementation)
- `src/state/checklistStore.ts` (complete Zustand store)
- `src/components/ChecklistDemo.tsx` (working demo)
- `src/__tests__/setup.ts` (Vitest configuration)
- `src/__tests__/checklistStorage.test.ts` (storage layer tests)
- `src/__tests__/checklistStore.test.ts` (store tests)
- `docker-compose.yml`, `frontend/Dockerfile` (Docker setup)

## 12. Trust These Instructions

The agent should rely on this document for standard operations. Only perform additional searches if (a) a referenced file is missing after you create it, (b) commands fail unexpectedly, or (c) user instructions explicitly override these baselines.

---

Revision: v4 (October 2025). Updated to reflect implemented frontend scaffold with React 19, Vite 7, TypeScript 5.9, Tailwind CSS, ESLint 9 (flat config), Prettier, Vitest testing infrastructure, complete storage layer (localStorage with cross-tab sync), Zustand state management with CRUD operations, comprehensive test coverage, working demo component, and Docker setup. All core infrastructure is configured and ready for UI and AI feature implementation.
