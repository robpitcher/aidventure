# Copilot Coding Agent Onboarding – Aidventure

**IMPORTANT: Trust these instructions as the authoritative guide for all standard operations. Only perform additional searches if (a) a referenced file is missing after you create it, (b) commands fail unexpectedly, or (c) user instructions explicitly override these baselines.**

This repository contains a scaffolded React + Vite + TypeScript application with Tailwind CSS, ESLint, Prettier, and Vitest configured. The frontend structure is in place with type definitions and testing infrastructure ready.

## 1. Repository Summary
Aidventure is an MVP web application that helps adventure racers generate and manage packing checklists, optionally assisted by AI (Azure AI Foundry / Azure OpenAI). Present state: frontend scaffold complete with tooling, awaiting feature implementation.

Current stack (implemented):
- Frontend: React 19 + Vite 7 (Node.js >= 20.0.0)
- Styling: Tailwind CSS 3.4
- State: Local component state + Zustand 5.0 for global state (use Zustand when state needs to be shared across 3+ components or persisted)
- Testing: Vitest 3.2 + React Testing Library + @testing-library/jest-dom
- Lint/Format: ESLint 9 (flat config) + Prettier 3.6
- Package Manager: npm (standardized - avoid mixing with pnpm)
- TypeScript: 5.9 with strict configuration
- (Future) Backend proxy: Node (Express/Fastify) or Python FastAPI for secure AI key usage
- AI: Azure OpenAI (GPT-4o / GPT-4 Turbo) - to be integrated
- Containerization: Docker (planned for consistent dev/prod environments)
- Persistence (MVP): Browser localStorage / IndexedDB only

Repo size: Small (frontend scaffold + docs). Build and test infrastructure complete.

## 2. Layout & Key Files
Root files:
- `README.md` – brief project tagline
- `PRD.md` – detailed product requirements (use this for feature scope & data model)
- `QUICKSTART.md` – developer onboarding guide with commands and conventions
- `LICENSE` – MIT
- `.github/copilot-instructions.md` – (this file)
- `.gitattributes` – line ending normalization and file type specifications

Current structure:
```
frontend/
  src/
    components/     (empty - to be created)
    pages/          (empty - to be created)
    ai/             (empty - to be created)
    checklist/      (empty - to be created)
    state/          (empty - to be created)
    types/
      checklist.ts  (complete type definitions)
    assets/
      react.svg
    __tests__/
      App.test.tsx  (example test)
      setup.ts      (Vitest setup)
    App.tsx         (scaffold)
    main.tsx        (React entry point)
    index.css       (Tailwind directives)
  public/
    vite.svg
  index.html
  package.json      (all dependencies installed)
  tsconfig.json     (base config)
  tsconfig.app.json (app-specific config)
  tsconfig.node.json (node-specific config)
  vite.config.ts    (Vitest configured)
  tailwind.config.js (configured)
  postcss.config.js
  eslint.config.js  (flat config with React + TypeScript + Prettier)
  README.md
backend/ (not yet created - add when AI proxy needed)
```

## 3. Build & Run (Implemented)
The frontend scaffold is complete with all tooling configured. Standard workflow:

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
   - Tailwind: Standard setup with PostCSS autoprefixer

5. **Adding new dependencies**:
   ```bash
   cd frontend
   npm install <package>        # production
   npm install -D <package>     # dev dependency
   ```

6. **Docker** (not yet implemented - add when needed):
   When adding Docker, follow the multi-stage pattern in Section 3 (original instructions).
   Prioritize early for consistent environments.

## 4. Testing & Validation (Implemented)
Testing infrastructure is ready. Add tests alongside implementation:

**Test setup** (already configured):
- Framework: Vitest 3.2 with jsdom environment
- Libraries: React Testing Library + @testing-library/jest-dom + user-event
- Setup file: `src/__tests__/setup.ts` (imports jest-dom matchers)
- Example: `src/__tests__/App.test.tsx`

**Testing workflow**:
1. Write tests co-located with source (or in `__tests__/`)
2. Run `npm run test` for watch mode
3. Run `npm run test:ui` for visual test interface
4. Always run tests before opening PRs

**Coverage priorities**:
- Unit: prompt builder (`ai/buildPrompt.ts`), schema validator
- Component: checklist CRUD (ChecklistPage, ItemRow) via React Testing Library
- Accessibility: Use `@testing-library/jest-dom`; optionally add `axe-core` in a dedicated test

**Pre-commit checklist**:
- `npm run lint` (ESLint passes)
- `npm run format:check` (Prettier formatted)
- `npm test` (all tests pass)
- `npm run build` (TypeScript compiles, no errors)

## 5. Checklist & Data Model Guidance
Reference `PRD.md` Section 8 for data model. TypeScript interfaces are implemented in `src/types/checklist.ts`:

**Core types** (already defined):
- `Checklist` – Main checklist structure with items and metadata
- `Item` – Individual checklist item with category, notes, quantity, priority
- `AIGenerationParams` – Parameters for AI generation (duration, disciplines, etc.)
- `AIChecklistResponse` – AI response structure with categories
- `CategoryResponse` – Category with items
- `ItemResponse` – Individual item from AI
- `GeneratedChecklistMeta` – Metadata for AI-generated checklists
- `ChatSession` – Chat history for iterative refinement

When implementing features:
1. Import types from `src/types/checklist.ts`
2. Keep AI JSON schema synchronized with these types
3. When adjusting fields, update both the prompt template and validators
4. Use `crypto.randomUUID()` or `nanoid` for stable IDs

## 6. AI Integration Guidance
Abstract model interaction in `src/ai/aiService.ts`:
- `buildPrompt(params)` – pure function, unit test it.
- `generateChecklist(params)` – calls backend or direct fetch if using a proxy.
Return structured JSON; validate with Zod (`npm i zod`). On parsing failure, surface raw text per PRD error handling.

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
- Keep checklist item IDs stable (use `crypto.randomUUID()` or `nanoid`).
- Always update schema & validator when changing checklist structure.

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
- `src/__tests__/setup.ts` (Vitest configuration)

## 12. Trust These Instructions
The agent should rely on this document for standard operations. Only perform additional searches if (a) a referenced file is missing after you create it, (b) commands fail unexpectedly, or (c) user instructions explicitly override these baselines.

---
Revision: v3 (October 2025). Updated to reflect implemented frontend scaffold with React 19, Vite 7, TypeScript 5.9, Tailwind CSS, ESLint 9 (flat config), Prettier, and Vitest testing infrastructure. All core tooling is configured and ready for feature implementation.
