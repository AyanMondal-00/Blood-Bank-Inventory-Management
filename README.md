# Blood Bank Inventory Management System

A production-ready, highly secure, and optimized web application designed for managing blood inventories, transaction audits, and standard pricing metrics.

---

## 🚀 Key Features

* **User Authentication & Verification**: Secure signup, login, and token-based sessions using JWT (JSON Web Tokens) and bcryptjs password hashing.
* **Role-Based Access Control (RBAC)**:
  * **System Administrators**: Access to price modifications, full transaction logs valuation cards.
  * **Staff Users**: Access to daily dispatch/intake operations, transaction tables, with restricted access to system settings.
* **Live Polling Dashboard**: Real-time stats board monitoring blood group availability. Polling runs silently in the background every 5 seconds without UI jarring.
* **Audit-Safe Inputs**: Logs the operator executing transactions automatically from the active JWT context. The forms lock fields (`received_by`, `issued_by`) as read-only.
* **ACID Transactions**: Guarantees database integrity during multi-query operations (e.g. updating blood stocks alongside logging transactions) with automatic connection rollback on exceptions.

---

## 🛠️ Technology Stack

### Backend REST API
* **Runtime**: Node.js (v18+)
* **Framework**: Express (v5)
* **Database**: MySQL (v8) using connection pooling with `mysql2/promise`
* **Security**: JSON Web Tokens (`jsonwebtoken`), Bcrypt password hashing (`bcryptjs`)

### Frontend Client
* **Tooling**: Vite
* **Library**: React (v19)
* **Styling**: Tailwind CSS
* **Routing**: React Router (v7) with Guard component wrappers

---

## 📂 Project Structure

```text
├── client/                     # React Vite Single Page App
│   ├── src/
│   │   ├── components/         # Reusable widgets (Sidebar, Topbar, Forms, etc.)
│   │   ├── hooks/              # custom contexts and hooks (useAuth)
│   │   ├── layouts/            # Layout wraps (MainLayout)
│   │   ├── pages/              # Routing views (Dashboard, Transactions, Login, etc.)
│   │   └── services/           # Backend API call service handler (api.js)
│
├── server/                     # Node.js Express REST API
│   ├── src/
│   │   ├── config/             # Database connection pool settings (db.js)
│   │   ├── controllers/        # Request handlers (auth, inventory, dashboard)
│   │   ├── middlewares/        # JWT security, inputs validation, global error wrap
│   │   ├── models/             # Safe parameterized database SQL queries
│   │   ├── routes/             # REST endpoint bindings
│   │   └── services/           # Concurrency-safe ACID business logic handlers
│
├── .env                        # Configuration file for Database & JWT
├── Dump.sql                    # Initial MySQL database backup schema
```

---

## 📖 Detailed System Documentation

For detailed information, please read the text files in the project workspace:

* 📋 **Database Details**: Refer to [DATABASE_SCHEMA.txt](file:///C:/Users/admin/OneDrive - SILICON SYSTEMS/Desktop/My Project/Blood Bank Inventory Management/DATABASE_SCHEMA.txt) for columns, indexes, and constraints details.
* 🏗️ **System Design & Core Principles**: Refer to [ARCHITECTURE.txt](file:///C:/Users/admin/OneDrive - SILICON SYSTEMS/Desktop/My Project/Blood Bank Inventory Management/ARCHITECTURE.txt) to study the backendMVC-Service structure and client-side guards pattern.
* ⚙️ **Quick Local Installation**: Refer to [QUICK_SETUP.txt](file:///C:/Users/admin/OneDrive - SILICON SYSTEMS/Desktop/My Project/Blood Bank Inventory Management/QUICK_SETUP.txt) for steps to restore database, configure local variables, install dependencies, and run servers.
