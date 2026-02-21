# 🏦 Mini Bank API

[![Test Status](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/Yopa28/minibank/actions)
[![Coverage](https://img.shields.io/badge/coverage-57%25-orange)](https://github.com/Yopa28/minibank)
[![Node.js Version](https://img.shields.io/badge/node-v14+-blue)](https://nodejs.org)
[![Express Version](https://img.shields.io/badge/express-v5.2.1-lightgrey)](https://expressjs.com)

A professional, clean-coded RESTful API for a banking system built with **Express.js**. This project implements core banking features like account management, deposits, withdrawals, and secure transfers with audit logging.

---

## 🏗️ System Architecture

This project follows the **Clean Architecture** pattern with a clear separation of concerns:

```mermaid
graph TD
    subgraph Presentation
        R[Routes] --> C[Controllers]
    end
    
    subgraph Logic
        C --> S[Services]
        S --> V[Validations]
        S --> U[Utils/AppError]
    end
    
    subgraph Data
        S --> Rep[Repositories]
        Rep --> DB[(In-Memory DB)]
    end

    style DB fill:#f9f,stroke:#333,stroke-width:2px
```

---

## 💸 Transfer Flow Diagram

The following diagram illustrates the logic flow for a money transfer between two accounts:

```mermaid
flowchart TD
    Start([Start Transfer]) --> Validate{Validate Input}
    Validate -- Invalid --> Error([Return Error])
    Validate -- Valid --> FindAccounts[Find Sender & Receiver]
    
    FindAccounts --> Exists{Accounts Exist?}
    Exists -- No --> Error
    Exists -- Yes --> Frozen{Account Frozen?}
    
    Frozen -- Yes --> Error
    Frozen -- No --> Balance{Sufficient Balance?}
    
    Balance -- No --> Error
    Balance -- Yes --> Update[Update Both Balances]
    
    Update --> Log[Record 'Transfer Out' & 'Transfer In']
    Log --> Audit[Create Audit Log Entry]
    Audit --> Success([Return Success Message])

    style Error fill:#ff9999
    style Success fill:#99ff99
```

---

## 🔄 Sequence Diagram: Transfer Operation

Detailed interaction between system components during a transfer request:

```mermaid
sequenceDiagram
    autonumber
    participant User as Client
    participant Controller
    participant Service
    participant Repo as Repository
    participant DB as Data Storage

    User->>Controller: POST /transfer
    Controller->>Service: transfer(fromId, toId, amount)
    
    par Find Accounts
        Service->>Repo: findById(fromId)
        Repo->>DB: Query Sender
        DB-->>Repo: Sender Data
        Repo-->>Service: sender
    and
        Service->>Repo: findById(toId)
        Repo->>DB: Query Receiver
        DB-->>Repo: Receiver Data
        Repo-->>Service: receiver
    end

    Note over Service: Logic: Validation, Frozen Check, Balance Check

    rect rgb(240, 240, 240)
        Note right of Service: Atomic-like Operations
        Service->>Repo: update(sender)
        Service->>Repo: update(receiver)
        Service->>Repo: create(tx_out)
        Service->>Repo: create(tx_in)
        Service->>Repo: create(audit_log)
    end

    Service-->>Controller: Transfer Successful
    Controller-->>User: 200 OK (Success Response)
```

---

## 📊 Entity Relationship Diagram (ERD)

The data structure and relationships within the system:

```mermaid
erDiagram
    ACCOUNT ||--o{ TRANSACTION : "records"
    ACCOUNT ||--o{ AUDIT_LOG : "monitored in"
    
    ACCOUNT {
        int id PK
        string name
        float balance
        boolean isFrozen
        date createdAt
    }
    
    TRANSACTION {
        int id PK
        int accountId FK
        string type "deposit|withdraw|transfer_in|transfer_out"
        float amount
        int referenceId FK "Target/Source Account"
        date createdAt
    }
    
    AUDIT_LOG {
        int id PK
        string action "DEPOSIT|WITHDRAW|TRANSFER"
        string entity "Account"
        int entityId FK
        string performedBy
        string description
        date createdAt
    }
```

---

## 📸 API Interaction Screenshots

Since this is a backend API, interaction is best visualized through professional API documentation and client tools:

### 1. Transfer Successfully Processed
```json
// POST /transfer
// Content-Type: application/json
{
    "fromId": 1,
    "toId": 2,
    "amount": 500,
    "performedBy": "Admin"
}

// Response: 200 OK
{
    "message": "Transfer successful"
}
```

### 2. Transaction Audit Logs
```json
// GET /accounts/1/transactions
[
  {
    "id": 1,
    "accountId": 1,
    "type": "transfer_out",
    "amount": 500,
    "referenceId": 2,
    "createdAt": "2024-03-21T12:00:00Z"
  }
]
```

## 🔐 Security Considerations

- Rate limiting implemented (per user sliding window)
- Role-based access control (RBAC)
- Centralized error handling to prevent stack leak
- Audit trail for all state-changing operations

---

## 🚀 Features

- ✅ **Account Management**: Create and track bank accounts.
- ✅ **Deposit**: Add funds to any account.
- ✅ **Withdrawal**: Safely remove funds with balance checking.
- ✅ **Inter-account Transfer**: Securely move money between accounts.
- ✅ **Account Freezing**: Security feature to prevent transactions on compromised accounts.
- ✅ **Audit Logging**: Every sensitive action is logged for tracking.
- ✅ **Comprehensive Validation**: Strict input checking for all operations.

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Yopa28/minibank.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
```bash
# Development mode
npm run dev

# Run tests
npm test
```

---

## 🧪 Testing and Quality

The project maintains high standards with **Jest** testing framework.

*   **Test Commands**: `npm test`
*   **Total Statements**: 100
*   **Covered Statements**: 57 (Core logic covered)
*   **Architecture Pattern**: Repository Pattern for testability.

---

Developed with ❤️ by [Yopa28](https://github.com/Yopa28)
