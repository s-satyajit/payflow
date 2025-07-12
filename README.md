# PayFlow

**Full‑Stack Payment Application**

PayFlow is a MERN‑stack web application that allows users to create accounts, link bank details, transfer funds, search for accounts, and view transaction history. Built with React (Vite), Node.js, Express, and MongoDB Atlas, deployed on Vercel.

---

## 📦 Features

* **User Authentication**: Sign up & Sign in with JWT-based sessions
* **Account Management**: Create and view multiple bank accounts
* **Fund Transfers**: Secure, atomic transactions between accounts
* **Search**: Lookup accounts by number, IFSC, or user name
* **Transaction History**: View, filter, and export transaction records
* **Dashboard**: Consolidated user profile, balances, and recent activity

---

## 🚀 Quick Start

1. **Clone the repo**

   ```bash
   git clone https://github.com/s-satyajit/payflow.git
   cd payflow
   ```

2. **Setup environment**

   * **Backend** (`server/`):

     ```bash
     cd server
     npm install
     ```

     Create `server/src/.env`:

     ```env
     MONGO_URI=<build-your-MongoDB-Atlas-URI>
     JWT_SECRET=<write-your-JWT-secret>
     ```

   * **Frontend** (`client/`):

     ```bash
     cd ../client
     npm install
     ```

     Create `client/.env`:

     ```env
     VITE_API_URL=<build-your-backend-api>/api/v1
     ```

3. **Local Development**

   * Start backend:

     ```bash
     cd server
     npm run dev
     ```
   * Start frontend:

     ```bash
     cd ../client
     npm run dev
     ```

Open [http://localhost:3000](http://localhost:3000) (or Vite’s port) in your browser.

---

## 📖 API Reference

*Base URL: `<build-your-api>/api/v1`* <br>
<br>
All routes `(except /auth/*)` are protected and require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint       | Body                                                        | Description               |
| ------ | -------------- | ----------------------------------------------------------- | ------------------------- |
| POST   | `/auth/signup` | `{ username, firstname, lastname, email, password, phone }` | Register new user         |
| POST   | `/auth/signin` | `{ email, password }`                                  | Login (email or username) |

### Account

| Method | Endpoint             | Query/Body                                | Description               |
| ------ | -------------------- | ----------------------------------------- | ------------------------- |
| GET    | `/account/create-account`           | `{accountNumber, ifsc, bankName}`                                | Create an account    |
| GET    | `/account/search-accounts?q=` | (query) accountNumber, IFSC, or user name | Search accounts           |
| POST   | `/account/get-account`| `{ accountNumber }`       | Get account details |

### Transaction

| Method | Endpoint                | Body                                                                       | Description                      |
| ------ | ----------------------- | -------------------------------------------------------------------------- | -------------------------------- |
| POST   | `/transaction/transfer-funds` | `{ id, toAccountNumber, ifsc, firstname, lastname, amount, description? }` | Transfer funds between accounts  |
| POST   | `/transaction/transactions`     | `{ userId }`                                                               | List all transactions for a user |

### User

| Method | Endpoint          | Body / Protected | Description                          |
| ------ | ----------------- | ---------------- | ------------------------------------ |
| GET    | `/user/user/me`   | Protected        | Get current user profile             |

---

## You can connect with me via

Email: satyajitsamal.workmail@gmail.com <br>
LinkedIn: https://linkedin.com/in/satyajitsamal <br>
X: https://x.com/satyajitstwt <br>
GitHub: https://github.com/s-satyajit <br>
Portfolio: https://satyajitsamal.vercel.app

