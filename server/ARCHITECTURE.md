# Server Architecture & Project Summary

This document describes the structure, responsibilities, and components of the Node.js + Express backend application for the Blood Bank Inventory Management system.

---

## 📂 Directory Tree & Responsibilities

```text
server/
├── src/
│   ├── config/             # Database & environment configuration
│   │   └── db.js           # MySQL connection pool setup using mysql2/promise
│   ├── controllers/        # Request handlers (processes inputs, returns responses)
│   │   ├── dashboardController.js  # Request/response logic for dashboard statistics
│   │   └── inventoryController.js  # Request/response logic for inventory and issuing blood
│   ├── middlewares/        # Express request pre-processors & interceptors
│   │   ├── errorMiddleware.js      # Global error handling and formatting middleware
│   │   └── inventoryValidation.js  # Validation logic for inventory operations
│   ├── models/             # Database access layer (contains raw SQL queries)
│   │   ├── dashboardModel.js       # SQL queries for counting stocks, group by type, etc.
│   │   ├── inventoryModel.js       # SQL queries for inventory CRUD operations
│   │   └── transactionModel.js     # SQL queries to log blood transactions (RECEIVE/ISSUE)
│   ├── routes/             # API Router definitions mapped to controllers
│   │   ├── dashboardRoutes.js      # Routes for `/api/dashboard`
│   │   ├── healthRoutes.js         # Service health status routes
│   │   └── inventoryRoutes.js      # Routes for `/api/inventory` (adding, fetching, issuing)
│   ├── services/           # Business logic layer (computations, validations, transactions)
│   │   ├── dashboardService.js     # Logic to prepare dashboard stats
│   │   └── inventoryService.js     # Logic for managing stock levels and issuing transactions
│   ├── utils/              # Utility helpers and standard wrapper classes
│   │   ├── ApiError.js             # Standardized API error class extending JS Error
│   │   ├── apiResponse.js          # Standardized API response format wrapper
│   │   └── asyncHandler.js         # Wrapper utility to catch exceptions in async express handlers
│   ├── app.js              # Express app setup (attaches middlewares, CORS, parsers, and base routes)
│   └── server.js           # App entry point (initiates database pool and starts HTTP server)
├── package.json            # Node.js dependencies and script definition file
└── package-lock.json       # Exact lockfile for node dependency versions
```

---

## 🛠️ Summary of Backend Work Done

The backend is built following a **Layered Architecture (Controller-Service-Model Pattern)** to ensure separation of concerns, scalability, and clean code:

### 1. Database Connection (`/config`)
*   Established a relational database connection using `mysql2/promise` pooling to ensure high performance under load.

### 2. Standardized Controllers (`/controllers`)
*   `getAllInventory` extracts and processes pagination inputs (`page`, `limit`) and delegates to the services.
*   `createInventory` processes adding/updating blood bags to stock.
*   `issueBlood` acts as the controller endpoint for releasing blood units.

### 3. Business Logic & Validation (`/services` & `/middlewares`)
*   Implemented strict validations before modifying the inventory.
*   In `issueBloodService`, the system checks if the requested blood type exists in sufficient quantities before proceeding. If stock is insufficient, it throws an `ApiError`.
*   Automatically calculates new units:
    *   **Receiving Blood**: Increases `received_unit` and `available_unit` in the database.
    *   **Issuing Blood**: Subtracts from `available_unit` to ensure stock is always accurate.

### 4. Database Log Tracking & Transactions (`/models`)
*   Every time blood is received or issued, the system creates a log in `blood_transactions` table (`RECEIVE`/`ISSUE` transaction types), maintaining an immutable audit trail of blood inventory changes.

### 5. Centralized Error & Response Handling (`/utils` & `/middlewares`)
*   All async controllers use `asyncHandler` to capture runtime exceptions cleanly without manual `try-catch` blocks.
*   Errors are caught globally by `errorMiddleware` and formatted into unified JSON objects.
*   Successful responses consistently use the `ApiResponse` class format.
