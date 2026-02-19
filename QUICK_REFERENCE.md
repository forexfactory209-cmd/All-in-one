# Quick Reference Guide
## React Native + TypeScript Folder Structure

This is a quick reference guide for the scalable folder structure. For complete details, see `FOLDER_STRUCTURE.md` and `HOMESCREEN_EXAMPLE.md`.

---

## 📁 Quick Structure Overview

```
src/
├── screens/              # Feature-based screens
│   └── [feature]/
│       └── [ScreenName]/
│           ├── components/     # Screen-specific UI components
│           ├── hooks/          # Screen-specific custom hooks
│           ├── popups/         # Screen-specific modals
│           ├── styles.ts       # Screen styles
│           └── ScreenName.tsx  # Main screen file
│
├── components/           # Global reusable components
│   └── [ComponentName]/
│       ├── ComponentName.tsx
│       ├── ComponentName.types.ts
│       └── ComponentName.styles.ts
│
├── services/            # API & external services
│   └── [serviceName]/
│       ├── serviceNameService.ts
│       └── serviceNameService.types.ts
│
├── store/               # Redux state management
├── hooks/               # Global custom hooks
├── utils/               # Utility functions
├── types/               # Global TypeScript types
├── theme/               # Design system
├── navigation/          # Navigation config
└── config/              # App configuration
```

---

## 🎯 File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Components** | PascalCase | `Button.tsx`, `PropertyCard.tsx` |
| **Hooks** | camelCase + `use` prefix | `useAuth.ts`, `usePropertyDetails.ts` |
| **Services** | camelCase + `Service` suffix | `authService.ts`, `propertyService.ts` |
| **Styles** | camelCase + `.styles.ts` | `Button.styles.ts`, `homeScreen.styles.ts` |
| **Types** | PascalCase + `.types.ts` | `Button.types.ts`, `User.ts` |
| **Utils** | camelCase | `validators.ts`, `dateFormatter.ts` |
| **Constants** | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_FILE_SIZE` |

---

## 🔄 Data Flow Pattern

```
┌─────────────────────────────────────────────────────────┐
│                    User Interaction                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              UI Component (Screen)                       │
│  - HomeScreen.tsx                                        │
│  - Only renders UI, handles user events                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Custom Hook (Business Logic)                │
│  - useFeaturedProperties.ts                             │
│  - Manages state, calls services                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Service Layer (API Calls)                   │
│  - propertyService.ts                                    │
│  - Handles all backend communication                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              API Client (Axios)                          │
│  - client.ts with interceptors                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ (Response flows back up)
┌─────────────────────────────────────────────────────────┐
│              Redux Store (if needed)                     │
│  - Global state management                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              UI Updates                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Code Templates

### 1. Screen Template

```typescript
// screens/[feature]/[ScreenName]/ScreenName.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Components
import { ComponentName } from './components/ComponentName';

// Hooks
import { useScreenLogic } from './hooks/useScreenLogic';

// Styles
import { styles } from './styles';

// Types
import { RootStackParamList } from '@/navigation/navigationTypes';

type ScreenNameProps = NativeStackScreenProps<RootStackParamList, 'ScreenName'>;

export const ScreenName: React.FC<ScreenNameProps> = ({ navigation, route }) => {
  const { data, loading, error } = useScreenLogic();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Your UI here */}
      </ScrollView>
    </SafeAreaView>
  );
};
```

### 2. Component Template

```typescript
// components/[ComponentName]/ComponentName.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ComponentNameProps } from './ComponentName.types';
import { styles } from './ComponentName.styles';

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

// ComponentName.types.ts
export interface ComponentNameProps {
  title: string;
  onPress: () => void;
}

// ComponentName.styles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: 16,
    color: colors.text.primary,
  },
});
```

### 3. Custom Hook Template

```typescript
// hooks/useCustomHook.ts
import { useState, useEffect } from 'react';
import { someService } from '@/services/someService';

interface UseCustomHookReturn {
  data: any;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCustomHook = (param: string): UseCustomHookReturn => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await someService.getData(param);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [param]);

  return { data, loading, error, refetch: fetchData };
};
```

### 4. Service Template

```typescript
// services/[serviceName]/serviceNameService.ts
import { apiClient } from '../api/client';
import { DataResponse, CreateDataRequest } from './serviceNameService.types';

class ServiceNameService {
  async getData(id: string): Promise<DataResponse> {
    const response = await apiClient.get(`/endpoint/${id}`);
    return response.data;
  }

  async createData(data: CreateDataRequest): Promise<DataResponse> {
    const response = await apiClient.post('/endpoint', data);
    return response.data;
  }

  async updateData(id: string, data: Partial<CreateDataRequest>): Promise<DataResponse> {
    const response = await apiClient.put(`/endpoint/${id}`, data);
    return response.data;
  }

  async deleteData(id: string): Promise<void> {
    await apiClient.delete(`/endpoint/${id}`);
  }
}

export const serviceNameService = new ServiceNameService();

// serviceNameService.types.ts
export interface DataResponse {
  id: string;
  name: string;
  // ... other fields
}

export interface CreateDataRequest {
  name: string;
  // ... other fields
}
```

---

## ✅ Dependency Rules

### Allowed ✅
- Screens → Components, Hooks, Services, Store
- Components → Hooks, Theme, Types
- Hooks → Services, Store, Utils
- Services → API Client, Types, Utils
- Store → Services, Types

### Forbidden ❌
- Services → Screens, Components, Hooks
- Components → Services (use hooks instead)
- Utils → Screens, Components, Hooks, Services

---

## 🎨 Import Path Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/screens/*": ["src/screens/*"],
      "@/services/*": ["src/services/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"],
      "@/theme/*": ["src/theme/*"],
      "@/store/*": ["src/store/*"],
      "@/navigation/*": ["src/navigation/*"]
    }
  }
}
```

Usage:
```typescript
// Instead of:
import { Button } from '../../../components/Button/Button';

// Use:
import { Button } from '@/components/Button/Button';
```

---

## 🚀 Quick Start Checklist

When creating a new screen:

- [ ] Create screen folder: `src/screens/[feature]/[ScreenName]/`
- [ ] Create `ScreenName.tsx` (main screen file)
- [ ] Create `styles.ts` (screen styles)
- [ ] Create `components/` folder (screen-specific components)
- [ ] Create `hooks/` folder (screen-specific hooks)
- [ ] Create `popups/` folder (if needed for modals)
- [ ] Add navigation route in `navigation/`
- [ ] Create service methods if API calls needed
- [ ] Define TypeScript types
- [ ] Test the screen

When creating a global component:

- [ ] Create folder: `src/components/[ComponentName]/`
- [ ] Create `ComponentName.tsx`
- [ ] Create `ComponentName.types.ts`
- [ ] Create `ComponentName.styles.ts`
- [ ] Export from component folder
- [ ] Document props and usage

---

## 📊 Project Statistics (Example)

For a typical vacation rental app:

| Category | Count | Notes |
|----------|-------|-------|
| **Screens** | 20-30 | Auth, Home, Property, Booking, Profile, etc. |
| **Global Components** | 15-25 | Button, Input, Card, Modal, etc. |
| **Services** | 8-12 | Auth, Property, Booking, User, etc. |
| **Custom Hooks** | 30-50 | Screen-specific + global |
| **Type Definitions** | 20-30 | Models, API types, etc. |

---

## 🔧 Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Hero** - Auto-import management
- **Path Intellisense** - Path autocomplete
- **React Native Tools** - Debugging and IntelliSense

---

## 📚 Additional Documentation

1. **FOLDER_STRUCTURE.md** - Complete folder structure with explanations
2. **HOMESCREEN_EXAMPLE.md** - Full implementation example
3. **PROJECT_REQUIREMENTS.md** - Product requirements and features

---

## 🎯 Key Principles to Remember

1. **Separation of Concerns** - UI, logic, and data are separate
2. **Single Responsibility** - Each file has one clear purpose
3. **DRY (Don't Repeat Yourself)** - Reuse components and hooks
4. **Type Safety** - Use TypeScript everywhere
5. **Consistent Naming** - Follow naming conventions strictly
6. **No Business Logic in UI** - Keep components pure
7. **No API Calls in Screens** - Use service layer
8. **Test Friendly** - Isolated code is easy to test

---

**Remember**: This structure is designed for **team collaboration** and **long-term maintainability**. Consistency is key!
