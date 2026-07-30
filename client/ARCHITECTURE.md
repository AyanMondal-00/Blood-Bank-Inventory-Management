# Client Architecture & Folder Structure

This document outlines the directory structure and architectural choices for the React + Vite frontend application of the Blood Bank Inventory Management system.

---

## 📂 Directory Tree

```text
client/
├── public/                 # Static assets (favicons, logos) that are served directly
├── src/                    # Source code of the application
│   ├── assets/             # Global assets (images, svg, fonts) handled by build pipeline
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Generic global components (Buttons, Modals, Inputs)
│   │   │   ├── Button.jsx  # Reusable base button
│   │   │   ├── Input.jsx   # Reusable form text input
│   │   │   ├── Loader.jsx  # Common page loading spinner
│   │   │   ├── Modal.jsx   # Generic popup modal window
│   │   │   └── StatCard.jsx# Reusable metrics card
│   │   ├── InventoryTable.jsx
│   │   ├── IssueForm.jsx
│   │   ├── ReceiveForm.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── Topbar.jsx
│   │   └── TransactionTable.jsx
│   ├── hooks/              # Custom React hooks (e.g., useAuth, useFetch)
│   ├── layouts/            # Page shell layout wrappers
│   │   └── MainLayout.jsx  # Primary layout containing Sidebar and Topbar
│   ├── pages/              # Routed pages representing entire views
│   │   ├── Dashboard.jsx   # Visual representation of stats & overall data
│   │   ├── Inventory.jsx   # Core inventory list table and options
│   │   ├── IssueBlood.jsx  # Form and processing for issuing blood
│   │   ├── ReceiveBlood.jsx# Form and processing for adding/receiving blood stock
│   │   └── Transactions.jsx# History and transaction logs page
│   ├── services/           # Network request configurations & API endpoints
│   │   └── api.js          # Base axios/fetch client setup (headers, baseURL, interceptors)
│   ├── utils/              # Helper functions, formatters, and global constants
│   ├── App.jsx             # App routing, context providers, and main wrapper
│   ├── index.css           # Global stylesheets and CSS variables
│   └── main.jsx            # Application mount point & React entry file
├── index.html              # HTML template entry point
├── vite.config.js          # Vite server and build configurations
├── eslint.config.js        # Code quality & style lint rules
└── package.json            # Dependencies and scripts definitions
```

---

## 🏗️ Core Architectural Guidelines

### 1. Separation of Concerns
*   **Presentational Layer (`/components`)**: Should focus solely on rendering UI and reacting to events via props. Avoid fetching data directly inside low-level components.
*   **Business Logic & Container Layer (`/pages`)**: Orchestrates the state, calls API services, and passes data down to presentational components.
*   **Service Layer (`/services`)**: Deals with raw HTTP clients and API route configurations. It separates server endpoint definitions from UI components.

### 2. State & Data Flow
*   Unidirectional data flow is maintained. State is kept at the page level or higher contexts and passed down to subcomponents.
*   Async side-effects and API communication should be handled in standard React lifecycles or hooks, calling functions exported from the `services/` folder.

### 3. Layouts & Routing
*   The layout wrapper (`MainLayout.jsx`) acts as a shell. It encloses components like the `Sidebar` and `Topbar` around standard child route components, providing a cohesive layout across different pages.
