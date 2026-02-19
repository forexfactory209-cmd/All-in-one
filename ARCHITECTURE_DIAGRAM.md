# Architecture Visual Diagram
## React Native + TypeScript Clean Architecture

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    REACT NATIVE + TYPESCRIPT                          ║
║                     CLEAN ARCHITECTURE                                ║
╚═══════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                               │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐              ┌─────────────────────┐       │
│  │   📱 SCREENS        │              │   🧩 COMPONENTS     │       │
│  ├─────────────────────┤              ├─────────────────────┤       │
│  │ screens/            │              │ components/         │       │
│  │  └─ [feature]/      │              │  └─ Button/         │       │
│  │     └─ ScreenName/  │              │  └─ Input/          │       │
│  │        ├─ components│              │  └─ Card/           │       │
│  │        ├─ hooks/    │              │  └─ Modal/          │       │
│  │        ├─ popups/   │              │  └─ Avatar/         │       │
│  │        ├─ styles.ts │              │                     │       │
│  │        └─ Screen.tsx│              │  Global Reusable    │       │
│  │                     │              │  Components         │       │
│  │  Only UI Rendering  │              │                     │       │
│  └─────────────────────┘              └─────────────────────┘       │
│           │                                     │                    │
└───────────┼─────────────────────────────────────┼────────────────────┘
            │                                     │
            ▼                                     ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                               │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐              ┌─────────────────────┐       │
│  │   🪝 CUSTOM HOOKS   │              │   🗄️  REDUX STORE   │       │
│  ├─────────────────────┤              ├─────────────────────┤       │
│  │ hooks/              │              │ store/              │       │
│  │  ├─ useAuth.ts      │              │  ├─ slices/         │       │
│  │  ├─ useDebounce.ts  │              │  │  ├─ authSlice   │       │
│  │  └─ usePermissions  │              │  │  ├─ userSlice   │       │
│  │                     │              │  │  └─ propertySlice│       │
│  │ Screen-specific:    │              │  ├─ selectors/      │       │
│  │ screens/[Screen]/   │              │  └─ index.ts        │       │
│  │  └─ hooks/          │              │                     │       │
│  │     ├─ useData.ts   │              │  Global State       │       │
│  │     └─ useLogic.ts  │              │  Management         │       │
│  │                     │              │                     │       │
│  │  Encapsulates Logic │              │                     │       │
│  └─────────────────────┘              └─────────────────────┘       │
│           │                                     │                    │
└───────────┼─────────────────────────────────────┼────────────────────┘
            │                                     │
            ▼                                     ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                                 │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐              ┌─────────────────────┐       │
│  │   🔌 SERVICES       │              │   🌐 API CLIENT     │       │
│  ├─────────────────────┤              ├─────────────────────┤       │
│  │ services/           │              │ services/api/       │       │
│  │  ├─ auth/           │              │  ├─ client.ts       │       │
│  │  │  ├─ Service.ts   │──────────────▶  ├─ interceptors.ts│       │
│  │  │  └─ types.ts     │              │  └─ endpoints.ts    │       │
│  │  ├─ property/       │              │                     │       │
│  │  ├─ booking/        │              │  Axios Instance     │       │
│  │  ├─ user/           │              │  + Interceptors     │       │
│  │  ├─ review/         │              │  + Error Handling   │       │
│  │  └─ payment/        │              │                     │       │
│  │                     │              │                     │       │
│  │  API Communication  │              │                     │       │
│  └─────────────────────┘              └─────────────────────┘       │
│           │                                     │                    │
└───────────┼─────────────────────────────────────┼────────────────────┘
            │                                     │
            └─────────────────┬───────────────────┘
                              ▼
                    ┌─────────────────────┐
                    │   🌍 BACKEND API    │
                    ├─────────────────────┤
                    │  Node.js + Express  │
                    │  MySQL Database     │
                    └─────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                     SUPPORTING LAYERS                                 │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ 🛠️ UTILS  │  │ 📝 TYPES  │  │ 🎨 THEME  │  │ 🧭 NAV   │            │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤            │
│  │ utils/   │  │ types/   │  │ theme/   │  │navigation│            │
│  │ ├─ valid │  │ ├─models │  │ ├─colors │  │ ├─ App   │            │
│  │ ├─ format│  │ ├─ api   │  │ ├─ typo  │  │ ├─ Auth  │            │
│  │ ├─ helper│  │ └─common │  │ ├─ space │  │ └─ Main  │            │
│  │ └─ const │  │          │  │ └─shadow │  │          │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                          DATA FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════════

    👤 User Interaction
           │
           ▼
    ┌──────────────┐
    │  UI Screen   │  ← Only renders UI, handles events
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ Custom Hook  │  ← Manages state, business logic
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   Service    │  ← API calls, data transformation
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ API Client   │  ← Axios instance, interceptors
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ Backend API  │  ← Node.js + Express + MySQL
    └──────┬───────┘
           │
           ▼ (Response flows back up)
    ┌──────────────┐
    │ Redux Store  │  ← Optional: Global state
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ UI Updates   │  ← Re-render with new data
    └──────────────┘


═══════════════════════════════════════════════════════════════════════
                        DEPENDENCY GRAPH
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│                         ALLOWED DEPENDENCIES                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Screens ──────────▶ Components, Hooks, Services, Store            │
│                                                                     │
│  Components ───────▶ Hooks, Theme, Types                           │
│                                                                     │
│  Hooks ────────────▶ Services, Store, Utils                        │
│                                                                     │
│  Services ─────────▶ API Client, Types, Utils                      │
│                                                                     │
│  Store ────────────▶ Services, Types                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       FORBIDDEN DEPENDENCIES                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Services ──────✗──▶ Screens, Components, Hooks                    │
│                                                                     │
│  Components ────✗──▶ Services (use hooks instead)                  │
│                                                                     │
│  Utils ─────────✗──▶ Screens, Components, Hooks, Services          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                    EXAMPLE: HomeScreen STRUCTURE
═══════════════════════════════════════════════════════════════════════

src/screens/home/HomeScreen/
│
├── components/                    ← Screen-specific UI components
│   ├── SearchBar.tsx             ← Search input component
│   ├── FeaturedProperties.tsx    ← Featured section
│   ├── CategoryList.tsx          ← Category chips
│   ├── PropertyCard.tsx          ← Property card component
│   └── RecommendedSection.tsx    ← Recommendations section
│
├── hooks/                         ← Screen-specific business logic
│   ├── useFeaturedProperties.ts  ← Fetch featured properties
│   ├── useRecommendations.ts     ← Fetch recommendations
│   └── useSearch.ts              ← Search logic
│
├── popups/                        ← Screen-specific modals
│   ├── FilterModal.tsx           ← Filter bottom sheet
│   └── LocationPickerModal.tsx   ← Location picker
│
├── styles.ts                      ← Screen-level styles
│
└── HomeScreen.tsx                 ← Main screen component
    │
    ├─ Imports components from ./components/
    ├─ Uses hooks from ./hooks/
    ├─ Renders modals from ./popups/
    ├─ Applies styles from ./styles.ts
    └─ Only orchestrates UI, no business logic


═══════════════════════════════════════════════════════════════════════
                      GLOBAL COMPONENT STRUCTURE
═══════════════════════════════════════════════════════════════════════

src/components/Button/
│
├── Button.tsx              ← Component implementation
│   │
│   ├─ Imports types from Button.types.ts
│   ├─ Imports styles from Button.styles.ts
│   └─ Exports Button component
│
├── Button.types.ts         ← TypeScript interfaces
│   │
│   └─ export interface ButtonProps { ... }
│
└── Button.styles.ts        ← Component styles
    │
    └─ export const styles = StyleSheet.create({ ... })


═══════════════════════════════════════════════════════════════════════
                         SERVICE STRUCTURE
═══════════════════════════════════════════════════════════════════════

src/services/property/
│
├── propertyService.ts      ← Service implementation
│   │
│   ├─ class PropertyService {
│   │    async getProperties() { ... }
│   │    async getPropertyById(id) { ... }
│   │    async createProperty(data) { ... }
│   │    async updateProperty(id, data) { ... }
│   │    async deleteProperty(id) { ... }
│   │  }
│   │
│   └─ export const propertyService = new PropertyService();
│
└── propertyService.types.ts ← Type definitions
    │
    ├─ export interface PropertyResponse { ... }
    ├─ export interface CreatePropertyRequest { ... }
    └─ export interface PropertyFilters { ... }


═══════════════════════════════════════════════════════════════════════
                        KEY PRINCIPLES
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  1. SEPARATION OF CONCERNS                                          │
│     UI ≠ Logic ≠ Data                                               │
│                                                                     │
│  2. SINGLE RESPONSIBILITY                                           │
│     Each file has ONE clear purpose                                 │
│                                                                     │
│  3. DRY (Don't Repeat Yourself)                                     │
│     Reuse components, hooks, and services                           │
│                                                                     │
│  4. TYPE SAFETY                                                     │
│     TypeScript everywhere, no 'any' types                           │
│                                                                     │
│  5. CONSISTENT NAMING                                               │
│     PascalCase for components, camelCase for functions              │
│                                                                     │
│  6. NO BUSINESS LOGIC IN UI                                         │
│     Keep components pure and presentational                         │
│                                                                     │
│  7. NO API CALLS IN SCREENS                                         │
│     Always use the service layer                                    │
│                                                                     │
│  8. TEST FRIENDLY                                                   │
│     Isolated code is easy to test                                   │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                         BENEFITS
═══════════════════════════════════════════════════════════════════════

FOR DEVELOPERS:
  ✅ Clear file locations - know exactly where to add code
  ✅ Reduced cognitive load - consistent patterns everywhere
  ✅ Faster development - reusable components and hooks
  ✅ Type safety - catch errors during development

FOR TEAMS:
  ✅ Reduced merge conflicts - features are isolated
  ✅ Easier code reviews - predictable structure
  ✅ Parallel development - multiple devs on different screens
  ✅ Quick onboarding - new developers understand structure fast

FOR THE PROJECT:
  ✅ Scalable - easy to add new features
  ✅ Maintainable - easy to locate and fix bugs
  ✅ Testable - isolated components and services
  ✅ Professional - industry-standard architecture

═══════════════════════════════════════════════════════════════════════
```
