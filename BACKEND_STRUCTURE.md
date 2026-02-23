# 🏗️ Backend Architectural Reference

This document serves as the **single source of truth** for the Somstay Backend structure. It ensures consistency across modules and defines where logic should reside.

## 📁 Directory Structure

```text
backend/
├── src/
│   ├── app.js                      # Express application setup & middleware orchestration
│   ├── server.js                   # Server entry point, port binding, and global error catchers
│   │
│   ├── config/                     # Core Configuration
│   │   ├── database.js             # MySQL2 Connection Pool setup
│   │   ├── env.js                  # Environment variable consolidation (dotenv)
│   │   └── constants.js            # App-wide enums (Roles, Booking/Payment Statuses)
│   │
│   ├── modules/                    # Feature-Based Domain Logic
│   │   ├── auth/                   # Login, Register, Password Reset
│   │   ├── users/                  # Profile & Identity management
│   │   ├── properties/             # Vacation Rentals logic
│   │   ├── realEstate/             # Long-term property sales/rentals
│   │   ├── cars/                   # Vehicle rental module
│   │   ├── bookings/               # UNIFIED booking engine
│   │   ├── payments/               # Transaction & Payout records
│   │   ├── reviews/                # Feedback & Moderation
│   │   ├── notifications/          # User-specific alert history
│   │   ├── reports/                # Analytics & Admin insights
│   │   └── admin/                  # System-wide administrative controls
│   │
│   ├── middleware/                 # Request Interceptors
│   │   ├── auth.middleware.js      # JWT Protection (isAuthenticated)
│   │   ├── role.middleware.js      # RBAC (restrictTo: 'admin', 'owner', etc.)
│   │   ├── error.middleware.js     # Global catch-all for errors (Dev vs Prod)
│   │   └── validation.middleware.js # Schema validation (using Joi/Express-validator)
│   │
│   ├── shared/                     # Cross-Module Business Services
│   │   ├── paymentGateway.service.js # ZAAD, eDahab, and Card logic
│   │   ├── invoice.service.js      # PDF Receipt & Document generation
│   │   └── notification.service.js # SMS, Email, and Push orchestration
│   │
│   └── utils/                      # Pure Stateless Helpers
│       ├── jwt.js                  # Token signing & verification
│       ├── otp.js                  # One-Time Password generation
│       ├── response.js             # Unified JSON response wrapper
│       └── helpers.js              # Formatting, Currency, and Slugs
│
└── package.json                    # Script & Dependency management
```

---

## 🛡️ Core Rules & Standards

1.  **Modular Isolation**: Every feature (Properties, Bookings, etc.) must reside in its own folder under `src/modules/`.
2.  **No Logic in Routes**: Routes must only map URLs to Controllers. Business logic belongs in **Services**.
3.  **Unified Responses**: NEVER send raw JSON from controllers. Use `utils/response.js`:
    - `sendResponse(res, 200, true, "Success message", data)`
    - `sendError(res, 400, "Error message")`
4.  **Environment Variables**: Always access `process.env` through `config/env.js` to ensure default values and type safety.
5.  **Role Verification**: Protect sensitive routes using `protect` followed by `restrictTo('admin', 'owner')`.

---

## ⚙️ Tech Stack Foundations
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (via `mysql2/promise`)
- **Security**: 
    - `helmet` for secure headers.
    - `bcryptjs` for hashing.
    - `jsonwebtoken` (JWT) for stateless sessions.
    - `express-rate-limit` for DDoS/Brute-force protection.

---

## 🚦 Common Workflows

### Adding a New Module
1. Create folder in `src/modules/[module_name]`.
2. Define `[module_name].routes.js`, `[module_name].controller.js`, `[module_name].service.js`, and `[module_name].repository.js`.
3. Register the routes in `src/app.js` under the prefix `/api/v1/[module_name]`.

### Handling a Payment
1. Receive request in `modules/payments/payments.controller.js`.
2. Use `shared/paymentGateway.service.js` to trigger external API (ZAAD/eDahab).
3. On success, use `shared/invoice.service.js` to generate the receipt.
4. Notify the user via `shared/notification.service.js`.
