## Product Requirements Document (PRD)
### AI Adventure Racing Assistant – MVP (Packing Checklist with AI Assist)

---

## 1. Executive Summary
Build an MVP web application that helps adventure racers create, refine, and manage packing checklists for races. Users can:

* Manually add checklist items
* Use an AI Assist conversational flow (Azure AI Foundry / Azure OpenAI) to generate a tailored packing checklist based on race parameters (duration, disciplines, location, weather window, team size, etc.)

Scope: Focus exclusively on the packing checklist experience (creation, editing, local or basic persistence) with a modern, accessible, outdoor‑themed UI and containerized local development. Future work may add authentication, templates, weather integrations, gear optimization, sharing, and broader race planning modules.

---

## 2. Goals & Non‑Goals
### 2.1 Goals (MVP)
* Clean, intuitive interface for building and viewing a race packing checklist
* Manual entry of checklist items (add / edit / delete / mark complete)
* AI Assist modal/panel guiding users via structured Q&A to generate an initial checklist
* Structured AI flow to reduce prompt anxiety (guided prompt engineering)
* Accessible UI (WCAG 2.1 AA targets) with outdoor racing theme
* Containerized local dev (Docker) minimal setup
* Abstract AI provider behind a service layer (Azure AI now, extensible later)

### 2.2 Non‑Goals (MVP)
* User authentication / accounts / multi-tenant persistence
* Cloud deployment automation (notes only)
* Real-time collaboration
* Advanced AI refinement loops beyond initial generation + optional regenerate
* External integrations (weather, maps, weight tracking)
* Offline PWA support

---

## 3. Target Users & Personas
| Persona | Description | Primary Needs |
|---------|-------------|---------------|
| New Adventure Racer | First 6–12 hr race | Guidance to not forget essentials |
| Experienced Weekend Racer | Has a system but wants efficiency | Quick generation + customization |
| Team Captain | Coordinates gear for team of 2–4 | Team-aware suggestions |
| Ultra / Expedition Racer | 24–72 hr+ race planning | Multi-discipline layering & contingency items |

---

## 4. User Stories (MVP)
### 4.1 High Priority
1. As a user, I can create a packing checklist from scratch.
2. As a user, I can add, edit, delete, and mark items complete.
3. As a user, I can open AI Assist and answer structured race questions.
4. As a user, I can generate a checklist and merge or replace my current list.
5. As a user, I can regenerate with modified parameters.
6. As a user, I can categorize items (Navigation, Nutrition, Clothing, Bike, Paddle, Emergency, etc.).
7. As a user, I can persist my checklist locally (localStorage / IndexedDB).
8. As a user, I can filter or sort items (by category, completeness).

### 4.2 Medium Priority
9. Duplicate an existing checklist.
10. Collapse/expand categories.

### 4.3 Future (Roadmap – Not MVP)
* Export to PDF/CSV
* Team-specific pack allocation
* Weight tracking & pack optimization
* Weather-aware suggestions
* Account login & cloud sync

---

## 5. Functional Requirements
### 5.1 Checklist Management
* Create an empty checklist or derive from AI results
* CRUD operations on items
* Item fields: name (required), description/notes (optional), category, status (checked/unchecked), quantity (optional)
* Bulk actions: mark all complete / reset all
* Client-side validation (non-empty names)

### 5.2 Categories
Default (seed) categories:
`Navigation`, `Clothing`, `Footwear`, `Nutrition/Hydration`, `Bike Gear`, `Paddle Gear`, `Safety/Medical`, `Lighting`, `Sleep (expedition)`, `Miscellaneous`.

### 5.3 AI Assist Flow
1. User clicks AI Assist
2. Modal or side drawer opens (conversational panel)
3. Bot sequentially collects:
	 * Race duration (hours or days)
	 * Disciplines (multi-select: Trek/Run, Bike, Paddle, Ropes, Navigation Intensive, Night Sections)
	 * Location / Region (Mountain, Desert, Temperate Forest, Coastal, Arctic, Tropical, or free text)
	 * Date or Season (month)
	 * Expected weather extremes (optional)
	 * Team vs Solo; if team, number of members
	 * Sleep strategy (None / Short catnaps / Planned bivy)
4. User can edit previous answers (maintain structured state)
5. Generate triggers system prompt + user context
6. AI returns structured JSON (checklist + per-category rationale, rationale optionally hidden/collapsible)
7. User options:
	 * Replace current checklist
	 * Merge (append only new categories/items)
	 * (Stretch) Selectively import items
8. Regenerate permitted after adjusting parameters

### 5.4 Data Persistence
* MVP: Browser localStorage or IndexedDB
* Abstraction layer to enable later backend (Postgres + API)
* (Optional) Simple server store (JSON / SQLite) if metrics are needed

### 5.5 AI System Prompt (Initial Draft)
Role: Expert Adventure Race Gear Planner (safety + efficiency mindset)

Output JSON schema:
```json
{
	"categories": [
		{
			"name": "Navigation",
			"items": [
				{ "itemName": "Waterproof topographic maps", "quantity": 1, "notes": "Pack in map case", "priority": "high" }
			]
		}
	]
}
```
Rules:
* Tailor to duration, disciplines, environment, team size
* Emphasize safety & minimal redundancy
* Avoid duplicate items

### 5.6 Error Handling
* AI failure: fallback UI with retry
* JSON parse error: show raw text + salvage option
* Network errors: friendly message + try again

---

## 6. Non‑Functional Requirements
### 6.1 Accessibility
* WCAG 2.1 AA contrast (≥4.5:1 normal text)
* Keyboard navigable modals
* ARIA labels on interactive elements
* Non-color status indicators (icons / patterns)

### 6.2 Performance
* Initial load < 2s (broadband)
* AI response target < 8s (spinner / skeleton feedback)

### 6.3 Security & Privacy
* No PII in MVP
* API keys server-side or env vars (never committed)
* If frontend would expose key, introduce lightweight backend proxy

### 6.4 Observability (MVP Lite)
* Console logging for AI latency
* Optional simple in-memory/file request log (if backend present)

### 6.5 Scalability (Future-Oriented)
* Modular service boundaries: checklist-service, ai-service
* Prepared for JWT/OIDC auth layer

---

## 7. Proposed Tech Stack (MVP)
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React + Vite (or Next.js later for SSR) | Fast dev, ecosystem |
| Styling | Tailwind CSS + theme tokens | Rapid iteration, consistency |
| State Mgmt | Local state + lightweight global (Zustand / Context) | Simplicity |
| Backend (optional) | Node.js (Express/Fastify) or Python FastAPI | Simple proxy, expandable |
| AI Integration | Azure AI Foundry (Azure OpenAI GPT‑4o / GPT‑4.1) | Reliability & enterprise |
| Container | Docker (multi-stage) | Portable dev |
| Persistence (MVP) | localStorage / IndexedDB | No auth required |
| Future DB | Postgres | Roadmap |
| Testing | Jest + React Testing Library | Critical flows |
| Lint/Format | ESLint + Prettier | Code quality |
| CI (Future) | GitHub Actions | Automated lint/test/build |

---

## 8. Data Model (MVP Local)
### 8.1 Checklist
```ts
type Checklist = {
	id: string;
	name: string;
	createdAt: string; // ISO
	updatedAt: string; // ISO
	items: Item[];
	generatedMeta?: GeneratedChecklistMeta;
};

type Item = {
	id: string;
	name: string;
	category: string;
	notes?: string;
	quantity?: number;
	priority?: 'high' | 'normal' | 'optional';
	completed: boolean;
};

type GeneratedChecklistMeta = {
	sourceParams: AIGenerationParams;
	chatSessionId?: string;
};

type AIGenerationParams = {
	duration: string | number;
	disciplines: string[];
	environment?: string;
	season?: string;
	teamSize?: number;
	sleepStrategy?: string;
	weatherExtremes?: string;
};

type ChatSession = {
	id: string;
	turns: { role: 'system' | 'user' | 'assistant'; content: string }[];
};
```

---

## 9. AI Interaction & Prompting Strategy
### 9.1 Conversation State Machine
States (linear, with ability to revisit earlier answers):
`CollectDuration` → `CollectDisciplines` → `CollectLocation` → `CollectSeason` → `CollectWeatherExtremes?` → `CollectTeamInfo` → `CollectSleepStrategy` → `ReviewParams` → `GenerateChecklist`

### 9.2 Prompt Assembly
* System Prompt (static base)
* Context Block: structured JSON of answers
* User Instruction: "Produce optimized checklist in required JSON schema. Avoid duplicates. Categorize. Mark essential items as priority=high."

### 9.3 Validation
* JSON.parse with try/catch
* Schema validation (Zod or lightweight custom)

---

## 10. UX / UI Design Guidelines
### 10.1 Layout
* Header: App name (e.g., “Aidventure Pack Planner”), AI Assist button (future: login placeholder)
* (Optional) Left panel: Category filters
* Main content: Checklist grouped by category (collapsible sections)
* Floating action button or top-level “Add Item” control
* Modal/drawer for AI Assist flow

### 10.2 Color Palette (Rugged & Accessible)
| Role | Color | Hex |
|------|-------|-----|
| Primary | Deep Forest Green | #1F3A2E |
| Secondary | Slate / Charcoal | #2F3E46 |
| Accent 1 (CTA) | Burnt Orange | #D9772B |
| Accent 2 (Panels) | Sky Mist / Light Gray | #E2E8E6 |
| Success/Complete | Muted Moss | #5F7F60 |
| Warning | Goldenrod | #D1A038 |

### 10.3 Typography
* Sans-serif (Inter or Source Sans)
* Headings weight 600; body 400

### 10.4 Icons
* Feather or Heroicons (check, edit, regenerate, AI spark)

### 10.5 Microcopy
* AI Assist button: “AI Assist (Generate Checklist)”
* Regenerate: “Adjust Inputs & Regenerate”
* Empty state: “Your checklist is empty. Start adding items or let AI help.”

---

## 11. API Contracts (Initial Sketch)
If backend proxy implemented:

`POST /api/ai/generate`
Request:
```json
{
	"durationHours": 12,
	"disciplines": ["Trek", "Bike", "Paddle"],
	"region": "Temperate Forest",
	"season": "October",
	"weatherExtremes": "Rain likely, night temps near 5C",
	"team": { "type": "team", "size": 3 },
	"sleepStrategy": "None"
}
```
Response:
```json
{
	"categories": [
		{
			"name": "Navigation",
			"items": [
				{ "itemName": "Waterproof topographic maps", "priority": "high" }
			]
		}
	],
	"advisories": ["Expect cold rain—ensure layered synthetics."]
}
```

---

## 12. Architecture Overview
Frontend (React)
→ (optional) Backend Proxy (Express / FastAPI)
→ Azure AI Foundry (Chat Completions API)

Local persistence (browser) stores user lists; future sync via backend DB.

### 12.1 Component Breakdown
* ChecklistPage
* CategorySection
* ItemRow (inline editable)
* AddItemForm
* AIAssistModal
* StepNavigator
* AnswerReview
* GenerateButton
* ResultPreview
* SettingsPanel (future)
* ThemeProvider

### 12.2 Service Layer (Examples)
`/ai/aiService.ts`
* buildPrompt(params)
* callAzureModel(promptParts)

`/checklist/store.ts`
* createChecklist, updateItem, toggleItemComplete, etc.

---

## 13. Deployment & Dev Environment
### 13.1 Local Dev
* Docker Compose for frontend (Node 20) + optional backend
* `.env` storing `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_KEY`, `MODEL_NAME`
* (Optional) Makefile targets: install, dev, build, lint, test

### 13.2 Example docker-compose.yml (Conceptual)
```yaml
services:
	frontend:
		build: ./frontend
		ports:
			- "3000:3000"
		env_file: .env
		volumes:
			- ./frontend:/app
	backend:
		build: ./backend
		ports:
			- "8080:8080"
		env_file: .env
		volumes:
			- ./backend:/app
```

### 13.3 Future Azure Deployment
* Azure Container Apps or Azure App Service
* Azure Key Vault (secrets)
* Azure Monitor / App Insights (deferred)

---

## 14. Testing Strategy
* Unit: Prompt builder, JSON schema validator
* Component: Checklist CRUD interactions
* Integration: AI Assist flow (mock API)
* Snapshot: Key UI states (empty, generated, error)
* Accessibility: axe-core automated checks

---

## 15. Metrics (Post-MVP Viability)
* # of AI-generated checklists per session
* Average # of manual edits after generation (AI quality proxy)
* Generation success rate (non-error)
* Time from opening AI Assist to generation (friction indicator)

---

## 16. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| AI hallucinations (irrelevant gear) | User trust loss | Constrain prompt, add disclaimer |
| Overly long lists | Overwhelm | Limit items per category; priority tagging |
| Model latency | Frustration | Loading indicators; future streaming |
| JSON parse errors | Feature blocked | Robust fallback & salvage parser |
| Scope creep (auth, sharing) | Delay MVP | Enforce feature freeze |
| Accessibility oversights | Exclusion | Automated + manual audits |

---

## 17. Milestones & Timeline (Indicative)
| Week | Focus |
|------|-------|
| 1 | Architecture scaffolding, UI wireframes, checklist CRUD base |
| 2 | AI Assist skeleton, prompt builder, mock AI responses |
| 3 | Azure AI integration, JSON validation, merge/replace logic |
| 4 | Styling polish, accessibility pass, testing, hardening |
| 5 | Buffer, docs (README, run instructions), pre-release review |

---

## 18. Open Questions
1. Include “Save Template” in MVP? (Currently no.)
2. Dark mode now or later?
3. Expose AI rationale by default or hide?
4. Need multi-language support (architect i18n early)?
5. Add analytics early (requires lightweight backend)?

---

## 19. Next Steps
* Align on open questions (product + engineering)
* Approve color palette & wireframes
* Confirm inclusion/exclusion of backend proxy in MVP
* Begin implementation per milestone schedule

---

## 20. Acceptance Criteria (Sample)
| Criterion | Description |
|-----------|-------------|
| Checklist CRUD | User creates a checklist, adds ≥5 items, marks them complete |
| AI Inputs | AI Assist collects ≥6 structured inputs and returns categorized list |
| Merge Behavior | Merge does not duplicate identical item names (case-insensitive) within a category |
| Accessibility | All interactive elements keyboard reachable (Tab / Shift+Tab) |
| Secret Handling | Model key never exposed in client bundle (if backend used) |

---

End of PRD.