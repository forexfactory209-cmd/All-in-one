# React Native + TypeScript Folder Structure
## Professional, Scalable, Feature-Based Architecture

---

## 📁 Complete Folder Structure

```
ticketproject/
│
├── src/
│   ├── screens/                          # All application screens
│   │   ├── auth/                         # Authentication screens
│   │   │   ├── LoginScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── SocialLoginButtons.tsx
│   │   │   │   │   └── ForgotPasswordLink.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useLogin.ts
│   │   │   │   │   └── useFormValidation.ts
│   │   │   │   ├── popups/
│   │   │   │   │   └── ForgotPasswordModal.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   └── LoginScreen.tsx
│   │   │   │
│   │   │   ├── RegisterScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── RegistrationForm.tsx
│   │   │   │   │   ├── RoleSelector.tsx
│   │   │   │   │   └── TermsCheckbox.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useRegister.ts
│   │   │   │   ├── popups/
│   │   │   │   │   └── RoleInfoModal.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   └── RegisterScreen.tsx
│   │   │   │
│   │   │   └── ForgotPasswordScreen/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── styles.ts
│   │   │       └── ForgotPasswordScreen.tsx
│   │   │
│   │   ├── home/                         # Home/Discovery screens
│   │   │   ├── HomeScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── FeaturedProperties.tsx
│   │   │   │   │   ├── CategoryList.tsx
│   │   │   │   │   ├── PropertyCard.tsx
│   │   │   │   │   └── RecommendedSection.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useFeaturedProperties.ts
│   │   │   │   │   ├── useRecommendations.ts
│   │   │   │   │   └── useSearch.ts
│   │   │   │   ├── popups/
│   │   │   │   │   ├── FilterModal.tsx
│   │   │   │   │   └── LocationPickerModal.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   └── HomeScreen.tsx
│   │   │   │
│   │   │   └── SearchResultsScreen/
│   │   │       ├── components/
│   │   │       │   ├── PropertyList.tsx
│   │   │       │   ├── MapView.tsx
│   │   │       │   ├── FilterChips.tsx
│   │   │       │   └── SortOptions.tsx
│   │   │       ├── hooks/
│   │   │       │   ├── useSearchResults.ts
│   │   │       │   └── useFilters.ts
│   │   │       ├── popups/
│   │   │       │   ├── FilterBottomSheet.tsx
│   │   │       │   └── SortBottomSheet.tsx
│   │   │       ├── styles.ts
│   │   │       └── SearchResultsScreen.tsx
│   │   │
│   │   ├── property/                     # Property-related screens
│   │   │   ├── PropertyDetailsScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ImageGallery.tsx
│   │   │   │   │   ├── PropertyInfo.tsx
│   │   │   │   │   ├── AmenitiesList.tsx
│   │   │   │   │   ├── HostProfile.tsx
│   │   │   │   │   ├── ReviewsList.tsx
│   │   │   │   │   ├── LocationMap.tsx
│   │   │   │   │   └── BookingCard.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── usePropertyDetails.ts
│   │   │   │   │   ├── useReviews.ts
│   │   │   │   │   └── useAvailability.ts
│   │   │   │   ├── popups/
│   │   │   │   │   ├── ImageViewerModal.tsx
│   │   │   │   │   ├── DatePickerModal.tsx
│   │   │   │   │   └── ReportPropertyModal.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   └── PropertyDetailsScreen.tsx
│   │   │   │
│   │   │   ├── CreatePropertyScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── PropertyTypeSelector.tsx
│   │   │   │   │   ├── LocationInput.tsx
│   │   │   │   │   ├── AmenitySelector.tsx
│   │   │   │   │   ├── PhotoUploader.tsx
│   │   │   │   │   ├── PricingForm.tsx
│   │   │   │   │   └── ProgressIndicator.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── usePropertyCreation.ts
│   │   │   │   │   ├── usePhotoUpload.ts
│   │   │   │   │   └── useLocationPicker.ts
│   │   │   │   ├── popups/
│   │   │   │   │   ├── AmenityPickerModal.tsx
│   │   │   │   │   └── PreviewModal.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   └── CreatePropertyScreen.tsx
│   │   │   │
│   │   │   └── ManagePropertiesScreen/
│   │   │       ├── components/
│   │   │       │   ├── PropertyListItem.tsx
│   │   │       │   ├── PropertyStats.tsx
│   │   │       │   └── QuickActions.tsx
│   │   │       ├── hooks/
│   │   │       │   └── useManageProperties.ts
│   │   │       ├── popups/
│   │   │       │   ├── EditPropertyModal.tsx
│   │   │       │   └── DeleteConfirmModal.tsx
│   │   │       ├── styles.ts
│   │   │       └── ManagePropertiesScreen.tsx
│   │   │
│   │   ├── booking/                      # Booking-related screens
│   │   │   ├── BookingRequestScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── BookingSummary.tsx
│   │   │   │   │   ├── GuestDetails.tsx
│   │   │   │   │   ├── PriceBreakdown.tsx
│   │   │   │   │   └── PaymentMethod.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useBookingRequest.ts
│   │   │   │   │   └── usePriceCalculation.ts
│   │   │   │   ├── popups/
│   │   │   │   │   ├── CancellationPolicyModal.tsx
│   │   │   │   │   └── PaymentMethodModal.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   └── BookingRequestScreen.tsx
│   │   │   │
│   │   │   ├── BookingConfirmationScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ConfirmationDetails.tsx
│   │   │   │   │   ├── NextSteps.tsx
│   │   │   │   │   └── ShareButtons.tsx
│   │   │   │   ├── hooks/
│   │   │   │   ├── styles.ts
│   │   │   │   └── BookingConfirmationScreen.tsx
│   │   │   │
│   │   │   └── MyBookingsScreen/
│   │   │       ├── components/
│   │   │       │   ├── BookingTabs.tsx
│   │   │       │   ├── BookingCard.tsx
│   │   │       │   └── EmptyState.tsx
│   │   │       ├── hooks/
│   │   │       │   └── useMyBookings.ts
│   │   │       ├── popups/
│   │   │       │   ├── BookingDetailsModal.tsx
│   │   │       │   └── CancelBookingModal.tsx
│   │   │       ├── styles.ts
│   │   │       └── MyBookingsScreen.tsx
│   │   │
│   │   ├── messages/                     # Messaging screens
│   │   │   ├── MessagesListScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ConversationCard.tsx
│   │   │   │   │   └── SearchBar.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useConversations.ts
│   │   │   │   ├── styles.ts
│   │   │   │   └── MessagesListScreen.tsx
│   │   │   │
│   │   │   └── ChatScreen/
│   │   │       ├── components/
│   │   │       │   ├── MessageBubble.tsx
│   │   │       │   ├── MessageInput.tsx
│   │   │       │   ├── BookingReference.tsx
│   │   │       │   └── TypingIndicator.tsx
│   │   │       ├── hooks/
│   │   │       │   ├── useChat.ts
│   │   │       │   └── useRealTimeMessages.ts
│   │   │       ├── popups/
│   │   │       │   └── ReportUserModal.tsx
│   │   │       ├── styles.ts
│   │   │       └── ChatScreen.tsx
│   │   │
│   │   ├── profile/                      # Profile screens
│   │   │   ├── ProfileScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   │   ├── VerificationBadges.tsx
│   │   │   │   │   ├── ReviewsSummary.tsx
│   │   │   │   │   └── MenuList.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useProfile.ts
│   │   │   │   ├── popups/
│   │   │   │   │   └── LogoutConfirmModal.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   └── ProfileScreen.tsx
│   │   │   │
│   │   │   ├── EditProfileScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ProfilePhotoUploader.tsx
│   │   │   │   │   ├── PersonalInfoForm.tsx
│   │   │   │   │   └── ContactInfoForm.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useEditProfile.ts
│   │   │   │   ├── styles.ts
│   │   │   │   └── EditProfileScreen.tsx
│   │   │   │
│   │   │   └── VerificationScreen/
│   │   │       ├── components/
│   │   │       │   ├── VerificationSteps.tsx
│   │   │       │   ├── IDUploader.tsx
│   │   │       │   └── PhoneVerification.tsx
│   │   │       ├── hooks/
│   │   │       │   └── useVerification.ts
│   │   │       ├── styles.ts
│   │   │       └── VerificationScreen.tsx
│   │   │
│   │   ├── reviews/                      # Review screens
│   │   │   ├── WriteReviewScreen/
│   │   │   │   ├── components/
│   │   │   │   │   ├── RatingStars.tsx
│   │   │   │   │   ├── CategoryRatings.tsx
│   │   │   │   │   ├── ReviewTextInput.tsx
│   │   │   │   │   └── PhotoUploader.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useWriteReview.ts
│   │   │   │   ├── styles.ts
│   │   │   │   └── WriteReviewScreen.tsx
│   │   │   │
│   │   │   └── ReviewsScreen/
│   │   │       ├── components/
│   │   │       │   ├── ReviewCard.tsx
│   │   │       │   ├── FilterTabs.tsx
│   │   │       │   └── RatingSummary.tsx
│   │   │       ├── hooks/
│   │   │       │   └── useReviews.ts
│   │   │       ├── popups/
│   │   │       │   └── FilterModal.tsx
│   │   │       ├── styles.ts
│   │   │       └── ReviewsScreen.tsx
│   │   │
│   │   └── admin/                        # Admin screens (Phase 2)
│   │       ├── AdminDashboardScreen/
│   │       ├── UserManagementScreen/
│   │       └── ListingApprovalScreen/
│   │
│   ├── components/                       # Global reusable components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── Button.styles.ts
│   │   │
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.types.ts
│   │   │   └── Input.styles.ts
│   │   │
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── Card.types.ts
│   │   │   └── Card.styles.ts
│   │   │
│   │   ├── Avatar/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Avatar.types.ts
│   │   │   └── Avatar.styles.ts
│   │   │
│   │   ├── Badge/
│   │   │   ├── Badge.tsx
│   │   │   ├── Badge.types.ts
│   │   │   └── Badge.styles.ts
│   │   │
│   │   ├── LoadingSpinner/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── LoadingSpinner.styles.ts
│   │   │
│   │   ├── EmptyState/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── EmptyState.types.ts
│   │   │   └── EmptyState.styles.ts
│   │   │
│   │   ├── ErrorBoundary/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ErrorBoundary.styles.ts
│   │   │
│   │   ├── BottomSheet/
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── BottomSheet.types.ts
│   │   │   └── BottomSheet.styles.ts
│   │   │
│   │   └── Modal/
│   │       ├── Modal.tsx
│   │       ├── Modal.types.ts
│   │       └── Modal.styles.ts
│   │
│   ├── navigation/                       # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   ├── TabNavigator.tsx
│   │   ├── navigationTypes.ts
│   │   └── navigationHelpers.ts
│   │
│   ├── services/                         # API & External services
│   │   ├── api/
│   │   │   ├── client.ts                 # Axios instance configuration
│   │   │   ├── interceptors.ts           # Request/response interceptors
│   │   │   └── endpoints.ts              # API endpoint constants
│   │   │
│   │   ├── auth/
│   │   │   ├── authService.ts            # Authentication API calls
│   │   │   └── authService.types.ts
│   │   │
│   │   ├── property/
│   │   │   ├── propertyService.ts        # Property CRUD operations
│   │   │   └── propertyService.types.ts
│   │   │
│   │   ├── booking/
│   │   │   ├── bookingService.ts         # Booking operations
│   │   │   └── bookingService.types.ts
│   │   │
│   │   ├── user/
│   │   │   ├── userService.ts            # User profile operations
│   │   │   └── userService.types.ts
│   │   │
│   │   ├── review/
│   │   │   ├── reviewService.ts          # Review operations
│   │   │   └── reviewService.types.ts
│   │   │
│   │   ├── message/
│   │   │   ├── messageService.ts         # Messaging operations
│   │   │   └── messageService.types.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── paymentService.ts         # Payment operations
│   │   │   └── paymentService.types.ts
│   │   │
│   │   └── upload/
│   │       ├── uploadService.ts          # File upload service
│   │       └── uploadService.types.ts
│   │
│   ├── store/                            # Redux state management
│   │   ├── index.ts                      # Store configuration
│   │   ├── rootReducer.ts
│   │   │
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── propertySlice.ts
│   │   │   ├── bookingSlice.ts
│   │   │   ├── messageSlice.ts
│   │   │   └── uiSlice.ts
│   │   │
│   │   └── selectors/
│   │       ├── authSelectors.ts
│   │       ├── userSelectors.ts
│   │       └── propertySelectors.ts
│   │
│   ├── hooks/                            # Global custom hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useKeyboard.ts
│   │   ├── usePermissions.ts
│   │   ├── useImagePicker.ts
│   │   └── useNetworkStatus.ts
│   │
│   ├── utils/                            # Utility functions
│   │   ├── validation/
│   │   │   ├── validators.ts
│   │   │   └── schemas.ts                # Yup/Zod schemas
│   │   │
│   │   ├── formatting/
│   │   │   ├── dateFormatter.ts
│   │   │   ├── currencyFormatter.ts
│   │   │   └── stringFormatter.ts
│   │   │
│   │   ├── helpers/
│   │   │   ├── asyncStorage.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── logger.ts
│   │   │   └── permissions.ts
│   │   │
│   │   └── constants/
│   │       ├── apiConstants.ts
│   │       ├── appConstants.ts
│   │       └── errorMessages.ts
│   │
│   ├── types/                            # Global TypeScript types
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Property.ts
│   │   │   ├── Booking.ts
│   │   │   ├── Review.ts
│   │   │   ├── Message.ts
│   │   │   └── Payment.ts
│   │   │
│   │   ├── api/
│   │   │   ├── requests.ts
│   │   │   └── responses.ts
│   │   │
│   │   └── common/
│   │       ├── navigation.ts
│   │       └── global.ts
│   │
│   ├── theme/                            # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── borderRadius.ts
│   │   └── index.ts
│   │
│   ├── assets/                           # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── animations/
│   │
│   ├── config/                           # App configuration
│   │   ├── env.ts                        # Environment variables
│   │   ├── firebase.ts                   # Firebase config (if used)
│   │   └── stripe.ts                     # Stripe config
│   │
│   └── App.tsx                           # Root component
│
├── __tests__/                            # Test files
│   ├── components/
│   ├── screens/
│   ├── services/
│   └── utils/
│
├── .env                                  # Environment variables
├── .env.example
├── .eslintrc.js
├── .prettierrc.js
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── package.json
└── README.md
```

---

## 🎯 Best Practices & Principles

### 1. **Separation of Concerns**
- **UI Components**: Only handle presentation and user interaction
- **Business Logic**: Contained in custom hooks and services
- **Data Fetching**: Isolated in service layer
- **State Management**: Centralized in Redux store

### 2. **Feature-Based Organization**
- Each screen is self-contained with its own components, hooks, and styles
- Easy to locate and modify screen-specific code
- Reduces merge conflicts in team development
- Facilitates code splitting and lazy loading

### 3. **Reusability**
- Global components are atomic and highly reusable
- Custom hooks encapsulate reusable logic
- Services provide consistent API interaction patterns
- Type definitions ensure type safety across the app

### 4. **Scalability**
- Easy to add new screens without affecting existing code
- Clear boundaries between features
- Modular architecture supports team collaboration
- Consistent patterns make onboarding easier

### 5. **Maintainability**
- Predictable file locations
- Consistent naming conventions
- Clear dependency flow (UI → Hooks → Services → API)
- Type safety prevents runtime errors

### 6. **Testing**
- Mirror structure in `__tests__` directory
- Easy to locate test files
- Isolated components are easier to test
- Services can be mocked for unit tests

---

## 📝 Naming Conventions

### Files & Folders
```typescript
// Components (PascalCase)
Button.tsx
PropertyCard.tsx
SearchBar.tsx

// Hooks (camelCase with 'use' prefix)
useAuth.ts
usePropertyDetails.ts
useDebounce.ts

// Services (camelCase with 'Service' suffix)
authService.ts
propertyService.ts
uploadService.ts

// Types (PascalCase with .types.ts suffix)
Button.types.ts
User.ts
Property.ts

// Styles (camelCase with .styles.ts suffix)
Button.styles.ts
homeScreen.styles.ts

// Utils (camelCase)
validators.ts
dateFormatter.ts
errorHandler.ts
```

### Code Conventions
```typescript
// Components: PascalCase
const PropertyCard: React.FC<PropertyCardProps> = () => {};

// Functions: camelCase
const calculateTotalPrice = (nights: number, pricePerNight: number) => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

// Interfaces/Types: PascalCase with 'I' prefix for interfaces (optional)
interface IUser {}
type PropertyType = 'apartment' | 'house' | 'villa';

// Enums: PascalCase
enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}
```

---

## 🏗️ Architecture Layers

### Layer 1: Presentation (UI)
```
screens/ + components/
↓
Renders UI, handles user interactions
No business logic, no API calls
```

### Layer 2: Business Logic (Hooks)
```
hooks/
↓
Encapsulates reusable logic
Manages local state
Calls services for data
```

### Layer 3: Data Access (Services)
```
services/
↓
API communication
Data transformation
Error handling
```

### Layer 4: State Management (Store)
```
store/
↓
Global application state
Redux slices and selectors
Persisted data
```

---

## 🔄 Data Flow

```
User Interaction
    ↓
UI Component (Screen/Component)
    ↓
Custom Hook (usePropertyDetails)
    ↓
Service Layer (propertyService.ts)
    ↓
API Client (axios)
    ↓
Backend API
    ↓
Response flows back up
    ↓
Redux Store (if needed)
    ↓
UI Updates
```

---

## 📦 Dependency Rules

### ✅ Allowed Dependencies
- **Screens** → Components, Hooks, Services, Store
- **Components** → Hooks, Theme, Types
- **Hooks** → Services, Store, Utils
- **Services** → API Client, Types, Utils
- **Store** → Services, Types

### ❌ Forbidden Dependencies
- **Services** → Screens, Components, Hooks
- **Components** → Services (use hooks instead)
- **Utils** → Screens, Components, Hooks, Services

---

## 🎨 Component Patterns

### Global Component Structure
```typescript
// components/Button/Button.types.ts
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

// components/Button/Button.styles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

export const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  // ... more styles
});

// components/Button/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ButtonProps } from './Button.types';
import { styles } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
```

---

## 🔐 Service Layer Pattern

### Service Structure
```typescript
// services/property/propertyService.types.ts
export interface CreatePropertyRequest {
  title: string;
  description: string;
  price_per_night: number;
  // ... more fields
}

export interface PropertyResponse {
  id: string;
  title: string;
  owner: UserResponse;
  // ... more fields
}

// services/property/propertyService.ts
import { apiClient } from '../api/client';
import { CreatePropertyRequest, PropertyResponse } from './propertyService.types';

class PropertyService {
  async getProperties(filters?: PropertyFilters): Promise<PropertyResponse[]> {
    const response = await apiClient.get('/properties', { params: filters });
    return response.data;
  }

  async getPropertyById(id: string): Promise<PropertyResponse> {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  }

  async createProperty(data: CreatePropertyRequest): Promise<PropertyResponse> {
    const response = await apiClient.post('/properties', data);
    return response.data;
  }

  async updateProperty(id: string, data: Partial<CreatePropertyRequest>): Promise<PropertyResponse> {
    const response = await apiClient.put(`/properties/${id}`, data);
    return response.data;
  }

  async deleteProperty(id: string): Promise<void> {
    await apiClient.delete(`/properties/${id}`);
  }
}

export const propertyService = new PropertyService();
```

---

## 🪝 Custom Hook Pattern

### Hook Structure
```typescript
// screens/property/PropertyDetailsScreen/hooks/usePropertyDetails.ts
import { useState, useEffect } from 'react';
import { propertyService } from '@/services/property/propertyService';
import { PropertyResponse } from '@/services/property/propertyService.types';

interface UsePropertyDetailsReturn {
  property: PropertyResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePropertyDetails = (propertyId: string): UsePropertyDetailsReturn => {
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getPropertyById(propertyId);
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
  };
};
```

---

## 📱 Screen Structure Pattern

### Screen Organization
```typescript
// screens/home/HomeScreen/HomeScreen.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar } from './components/SearchBar';
import { FeaturedProperties } from './components/FeaturedProperties';
import { CategoryList } from './components/CategoryList';
import { useFeaturedProperties } from './hooks/useFeaturedProperties';
import { useSearch } from './hooks/useSearch';
import { styles } from './styles';

export const HomeScreen: React.FC = () => {
  const { properties, loading } = useFeaturedProperties();
  const { searchQuery, handleSearch } = useSearch();

  return (
    <ScrollView style={styles.container}>
      <SearchBar value={searchQuery} onSearch={handleSearch} />
      <CategoryList />
      <FeaturedProperties properties={properties} loading={loading} />
    </ScrollView>
  );
};
```

---

## 🚀 Benefits of This Structure

### For Individual Developers
✅ Clear file locations - know exactly where to add code  
✅ Reduced cognitive load - consistent patterns everywhere  
✅ Faster development - reusable components and hooks  
✅ Type safety - catch errors during development  

### For Teams
✅ Reduced merge conflicts - features are isolated  
✅ Easier code reviews - predictable structure  
✅ Parallel development - multiple devs can work on different screens  
✅ Onboarding - new developers understand structure quickly  

### For the Project
✅ Scalable - easy to add new features  
✅ Maintainable - easy to locate and fix bugs  
✅ Testable - isolated components and services  
✅ Professional - industry-standard architecture  

---

## 📚 Additional Resources

### Recommended Libraries
- **Navigation**: `@react-navigation/native`
- **State Management**: `@reduxjs/toolkit`, `react-redux`
- **Forms**: `react-hook-form`
- **Validation**: `yup` or `zod`
- **HTTP Client**: `axios`
- **Date Handling**: `date-fns`
- **UI Components**: `react-native-paper` or custom
- **Icons**: `react-native-vector-icons`
- **Image Handling**: `react-native-fast-image`
- **Maps**: `react-native-maps`

### Code Quality Tools
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Jest + React Native Testing Library
- **Git Hooks**: Husky + lint-staged

---

**Next Steps**: See `HOMESCREEN_EXAMPLE.md` for a complete implementation example.
