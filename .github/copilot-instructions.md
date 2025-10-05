# Copilot Coding Agent Onboarding – Aidventure

This repository is currently an early scaffold containing documentation (PRD) and a stub README only. There is no application source code yet. Use these instructions as the authoritative guide for adding code. Only search if the needed info is missing or contradictory.

## 1. Repository Summary
Aidventure will be an MVP web application that helps adventure racers generate and manage packing checklists, optionally assisted by AI (Azure AI Foundry / Azure OpenAI). Present state: design + requirements only.

Planned stack (when code is added):
- Frontend: React + Vite (Node.js runtime, target Node 20 LTS)
- Styling: Tailwind CSS
- State: Local component state + lightweight global (Zustand or Context API)
- Testing: Jest + React Testing Library
- Lint/Format: ESLint + Prettier
- (Optional) Backend proxy: Node (Express/Fastify) or Python FastAPI for secure AI key usage
- AI: Azure OpenAI (GPT-4o / GPT-4.1)
- Containerization: Docker / docker-compose
- Persistence (MVP): Browser localStorage / IndexedDB only

Repo size: Tiny (only docs). No build scripts, package manifests, or workflows yet.

## 2. Layout & Key Files
Root files:
- `README.md` – brief project tagline
- `PRD.md` – detailed product requirements (use this for feature scope & data model)
- `LICENSE` – MIT
- `.github/copilot-instructions.md` – (this file)
No other directories exist yet. Creating new app code will introduce `frontend/` (and optionally `backend/`).

Recommended initial structure (create when implementing):
```
frontend/
  src/
    components/
    pages/
    ai/
    checklist/
    state/
  index.html
  src/main.tsx (or .tsx entry)
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.js
  postcss.config.js
backend/ (optional for AI key proxy later)
```

## 3. Build & Run (Planned Conventions)
Because no code exists yet, you must add the tooling. Follow this canonical sequence when you introduce code:
1. Always create `package.json` (set engines.node >= 20). Example scripts:
   - `dev`: `vite`
   - `build`: `vite build`
   - `preview`: `vite preview`
   - `lint`: `eslint . --ext .ts,.tsx`
   - `test`: `jest`
2. Always run dependency install (`npm install` or `pnpm install`) before any build/test.
3. Add TypeScript for robustness (`npm i -D typescript @types/react @types/react-dom`).
4. Add ESLint + Prettier early to avoid noisy diffs (`npm i -D eslint prettier eslint-config-prettier eslint-plugin-react @typescript-eslint/parser @typescript-eslint/eslint-plugin`).
5. Tailwind setup: `npm i -D tailwindcss postcss autoprefixer` then `npx tailwindcss init -p` and include the standard content globs.
6. Testing: `npm i -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom` then configure `jest.config.ts` using `ts-jest` preset.
7. For state management if using Zustand: `npm i zustand`.
8. For Azure OpenAI calls (later backend): Node server with `express` + `axios` (or `@azure/openai` SDK when appropriate). Keep keys in `.env` (never commit). Add `.env.example`.

When implementing Docker (optional early):
```
# frontend/Dockerfile (example multi-stage)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm i -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```
Always confirm local build succeeds before committing container changes.

## 4. Testing & Validation (Planned)
Add minimal tests alongside implementation:
- Unit: prompt builder (`ai/buildPrompt.ts`), schema validator.
- Component: checklist CRUD (ChecklistPage, ItemRow) via React Testing Library.
- Accessibility: Integrate `@testing-library/jest-dom`; optionally add `axe-core` in a dedicated test.
Always run `npm test` (or `pnpm test`) before opening PRs. Ensure TypeScript compile passes (`tsc --noEmit`).

## 5. Checklist & Data Model Guidance
Reference `PRD.md` Section 8 for data model. Implement TypeScript interfaces in a single source of truth file, e.g. `src/types/checklist.ts`. Keep AI JSON schema synchronized with those types. When adjusting fields, update both the prompt template and validators.

## 6. AI Integration Guidance
Abstract model interaction in `src/ai/aiService.ts`:
- `buildPrompt(params)` – pure function, unit test it.
- `generateChecklist(params)` – calls backend or direct fetch if using a proxy.
Return structured JSON; validate with Zod (`npm i zod`). On parsing failure, surface raw text per PRD error handling.

Never expose Azure keys client-side. If no backend yet, mock responses until backend layer is introduced.

## 7. Linting & Formatting (Planned Baseline)
Create `.eslintrc.cjs` with React, TypeScript, and Prettier integration. Always run lint before PR: `npm run lint`. Enforce formatting via Prettier (add a pre-commit hook later using Husky if desired).

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
If starting code from scratch, create in this order to minimize churn:
1. `frontend/package.json`
2. `frontend/tsconfig.json`
3. `frontend/vite.config.ts`
4. `frontend/index.html`
5. `frontend/src/main.tsx` + root React component
6. `frontend/src/types/checklist.ts`
7. `frontend/src/checklist/ChecklistPage.tsx`
8. `frontend/src/ai/aiService.ts`
9. Tests under `frontend/src/__tests__/`

## 12. Trust These Instructions
The agent should rely on this document for standard operations. Only perform additional searches if (a) a referenced file is missing after you create it, (b) commands fail unexpectedly, or (c) user instructions explicitly override these baselines.

---
Revision: v1 (initial onboarding). Keep under two pages by focusing on operational essentials.
