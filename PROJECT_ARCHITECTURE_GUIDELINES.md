# PROJECT ARCHITECTURE GUIDELINES - SOMSTAY

## 1. Project Overview
**Somstay** is a high-frequency, professional Vacation Rental Platform. Managed exclusively by the owner (no brokers/external providers), the platform ensures a premium, trusted experience for travelers in Somaliland.

## 2. Technology Stack
- **Mobile App**: React Native (Expo) - Premium, high-frequency UI.
- **Admin Panel**: React (Web) - Operational management interface consuming Backend APIs.
- **Backend**: Node.js + Express - Centralized business logic and API layer.
- **Database**: MySQL - Relational data persistence.
- **Payments**: Local (ZAAD, eDahab) and International (Visa, MasterCard).

## 3. MVP Limitations (STRICT)
- **No Wallet System**: Payments are direct; no internal credit/wallet balances.
- **No Escrow System**: Funds flow directly upon booking confirmation.
- **No Complex Automation**: Manual or semi-automated flows for operational efficiency.
- **No AI/ML**: No recommendation engines or advanced predictive analytics.
- **No Advanced Refunds**: Refunds are handled via simple status transitions.

## 4. Architecture Rules
- **Modular Design**: Features must be encapsulated in their own modules.
- **API-First Admin**: The Admin Panel must never touch the database or business logic directly; it only consumes Backend APIs.
- **Backend Logic Centralization**: 100% of business logic (pricing, availability calculation, booking constraints) resides in the Node/Express layer.
- **Separation of Concerns**: UI components must be stateless/display-only where possible, relying on hooks/services for data.

## 5. Payment & Booking Rules
- **Strict Control**: Booking status is directly controlled by Payment status.
- **Payment Hooks**: Successful payment response from gateways (ZAAD, eDahab, etc.) triggers the "Confirmed" state of a booking.
- **Atomic Transactions**: Booking creation and payment initiation must maintain data integrity.

## 6. Folder Structure Standards
- **Feature-Based Modularity**: Every domain (e.g., Properties, Bookings) must have its own encapsulated folder in `src/pages/`.
- **Internal Page Structure**: Every module folder must contain exactly these subdirectories:
    - `pages/`: Main entry point screens and sub-routes.
    - `components/`: UI pieces unique to this specific module.
    - `popups/`: Modals, dialogs, and bottom sheets unique to this module.
    - `sections/`: Large, logical blocks of UI used to assemble pages (e.g., `BookingTable.js`).
    - `services/`: All API calls and network logic for the module (Pure API Consumer).
- **Shared Assets**: Global reusable components, hooks, and theme tokens live in `src/shared/`, `src/hooks/`, and `src/theme/`.

## 7. Security & Scale
- **Backend Validation**: All inputs must be sanitized and validated on the backend.
- **Role-Based Access (RBAC)**: Strict separation between Admin roles and Customer permissions.
- **Clean Code**: Adherence to SOLID principles and DRY (Don't Repeat Yourself).

## 8. Development Constraints
- **Performance**: High-frequency interaction requires optimized API responses.
- **Verification First**: Every property is verified; the code must support verification indicators.
- **No mixing UI & Business Logic**: Business rules must never be hardcoded in React/React Native screens.
