# Payment API Documentation

## Overview

This document provides comprehensive documentation for the Payment API implemented in the Real Estate Booking System. The API enables secure blockchain-based payment processing for property bookings with duplicate payment prevention and transaction status tracking.

## Table of Contents

1. [Quick Start](#quick-start)
2. [API Endpoint](#api-endpoint)
3. [Request/Response Format](#requestresponse-format)
4. [Error Handling](#error-handling)
5. [Database Schema](#database-schema)
6. [Testing Guide](#testing-guide)
7. [Integration Notes](#integration-notes)

---

## Quick Start

### Starting the Development Environment

Run both frontend and backend with a single command:

```bash
# Option 1: Using the start script
./start.dev.sh

# Option 2: Using npm
npm run dev

# Option 3: Using npm start:dev
npm run start:dev
```

This will start:

- **Backend Server:** http://localhost:8000
- **Frontend Client:** http://localhost:5173

### Install All Dependencies

```bash
npm run install:all
```

### Generate Prisma Client

```bash
npm run prisma:generate
```

### Push Database Schema

```bash
npm run prisma:push
```

---

## API Endpoint

### Create Payment Intent

Creates a new payment intent for booking a property.

**Endpoint:** `POST /api/payments/create-intent`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "propertyId": "string (MongoDB ObjectId)",
  "userId": "string",
  "amount": 500,
  "currency": "USD"
}
```

| Field        | Type   | Required | Description                                       |
| ------------ | ------ | -------- | ------------------------------------------------- |
| `propertyId` | string | Yes      | MongoDB ObjectId of the property being booked     |
| `userId`     | string | Yes      | Unique identifier for the user making the payment |
| `amount`     | number | Yes      | Payment amount (must be positive)                 |
| `currency`   | string | Yes      | Currency code (USD, EUR, GBP, CAD, AUD)           |

---

## Request/Response Format

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Payment transaction created successfully",
  "data": {
    "paymentId": "507f1f77bcf86cd799439011",
    "transactionId": "tx_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "amount": 500,
    "currency": "USD",
    "status": "PENDING"
  }
}
```

### Error Responses

#### 400 Bad Request - Missing Fields

```json
{
  "success": false,
  "message": "Missing required fields: propertyId, userId, amount, and currency are required"
}
```

#### 400 Bad Request - Invalid Amount

```json
{
  "success": false,
  "message": "Amount must be a positive number"
}
```

#### 400 Bad Request - Invalid Currency

```json
{
  "success": false,
  "message": "Invalid currency. Supported currencies: USD, EUR, GBP, CAD, AUD"
}
```

#### 409 Conflict - Duplicate Payment (Completed)

```json
{
  "success": false,
  "message": "Payment already completed for this property",
  "paymentId": "507f1f77bcf86cd799439011"
}
```

#### 409 Conflict - Duplicate Payment (Pending)

```json
{
  "success": false,
  "message": "A pending payment already exists for this property",
  "paymentId": "507f1f77bcf86cd799439011",
  "transactionId": "tx_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

---

## Additional Endpoints

### Process Payment

Updates the payment status after blockchain confirmation.

**Endpoint:** `POST /api/payments/process`

**Request Body:**

```json
{
  "transactionId": "tx_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "status": "COMPLETED"
}
```

| Status      | Description            |
| ----------- | ---------------------- |
| `COMPLETED` | Payment was successful |
| `FAILED`    | Payment failed         |
| `REFUNDED`  | Payment was refunded   |

### Blockchain Webhook

Handles blockchain transaction confirmation events.

**Endpoint:** `POST /api/payments/webhook`

**Request Body:**

```json
{
  "type": "transaction.confirmed",
  "data": {
    "transactionId": "tx_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  }
}
```

### Get Payment by ID

**Endpoint:** `GET /api/payments/:id`

### Get User Payments

**Endpoint:** `GET /api/payments/user/:userId`

---

## Error Handling

The API uses standard HTTP status codes:

| Status Code | Description                   |
| ----------- | ----------------------------- |
| 200         | Success                       |
| 201         | Created                       |
| 400         | Bad Request - Invalid input   |
| 404         | Not Found                     |
| 409         | Conflict - Duplicate resource |
| 500         | Internal Server Error         |

---

## Database Schema

### Payment Model (Prisma)

```prisma
enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
}

model Payment {
    id              String        @id @default(auto()) @map("_id") @db.ObjectId
    propertyId      String        @db.ObjectId
    userId          String
    amount          Int
    currency        String        @default("USD")
    status          PaymentStatus @default(PENDING)
    paymentIntentId String?       @unique
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt

    @@unique(fields: [propertyId, userId])
}
```

### Key Features:

- **Unique Constraint:** Prevents duplicate payments for the same property by the same user
- **Status Tracking:** Tracks payment lifecycle (PENDING → COMPLETED/FAILED/REFUNDED)
- **Transaction ID:** Unique identifier for blockchain transaction tracking

---

## Testing Guide

### Prerequisites

1. Ensure MongoDB is running and connected
2. Server is running on port 8000 (default)

### Using cURL

#### Test 1: Create Payment Intent (Success)

```bash
curl -X POST http://localhost:8000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "amount": 500,
    "currency": "USD"
  }'
```

#### Test 2: Missing Required Fields

```bash
curl -X POST http://localhost:8000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "507f1f77bcf86cd799439011"
  }'
```

#### Test 3: Invalid Amount

```bash
curl -X POST http://localhost:8000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "amount": -100,
    "currency": "USD"
  }'
```

#### Test 4: Invalid Currency

```bash
curl -X POST http://localhost:8000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "amount": 500,
    "currency": "XYZ"
  }'
```

#### Test 5: Duplicate Payment (run Test 1 twice)

```bash
# Run the same request again - should return 409 Conflict
curl -X POST http://localhost:8000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "amount": 500,
    "currency": "USD"
  }'
```

### Using Postman

1. Create a new POST request
2. URL: `http://localhost:8000/api/payments/create-intent`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "propertyId": "507f1f77bcf86cd799439011",
  "userId": "user123",
  "amount": 500,
  "currency": "USD"
}
```

---

## Integration Notes

### Production Considerations

1. **Blockchain Integration:**
   - Replace the `crypto.randomBytes` transaction ID generation with actual blockchain transaction hash
   - Implement on-chain transaction verification
   - Support multiple blockchain networks (Ethereum, Polygon, BSC)

2. **Security:**
   - Add authentication middleware to protect endpoints
   - Implement rate limiting
   - Validate propertyId exists in the database
   - Verify wallet signatures for transactions

3. **Environment Variables:**
   Already configured in `.env`:
   ```
   ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
   POLYGON_RPC_URL=https://polygon-rpc.com
   BSC_RPC_URL=https://bsc-dataseed1.binance.org
   INFURA_PROJECT_ID=YOUR_INFURA_PROJECT_ID
   ALCHEMY_API_KEY=YOUR_ALCHEMY_KEY
   ```

---

## File Structure

```
Real-Estate-Booking/
├── start.dev.sh           # Development start script (runs both servers)
├── package.json           # Root package.json with dev scripts
├── docs/
│   └── PAYMENT_API.md     # This documentation
├── server/
│   ├── controllers/
│   │   └── paymentCntrl.js    # Payment controller with business logic
│   ├── routes/
│   │   └── paymentRoute.js    # Payment route definitions
│   ├── prisma/
│   │   └── schema.prisma      # Database schema with Payment model
│   └── index.js               # Main server file with payment route registration
└── client/
    └── src/                   # React frontend source
```

---

## Author

Joseph Awe (Jossyboydgenius)

## License

MIT
