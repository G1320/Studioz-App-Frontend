# PayMe Backend Integration Requirements

## Overview
The frontend PayMe integration is complete. You need to implement the following backend API endpoints to make it functional.

## Required Backend Endpoints

### Base URL
All endpoints should be prefixed with `/api/payme`

### 1. Generate Payment
**Endpoint:** `POST /api/payme/generate-payment`

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "ILS",
  "description": "Studio booking - 2 item(s)",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+972501234567"
  },
  "items": [
    {
      "name": "Recording Studio at Studio Name",
      "price": 50.00,
      "quantity": 2,
      "itemId": "item123",
      "studioId": "studio456"
    }
  ],
  "vendorId": "vendor789",
  "successUrl": "http://localhost:5173/payment-success",
  "cancelUrl": "http://localhost:5173/payment-cancelled",
  "ipnUrl": "http://localhost:5173/api/payme/ipn"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment_id": "pay_123456789",
    "payment_url": "https://payme.io/checkout/...", // If using hosted payment page
    "identifier": "unique_identifier",
    "public_key": "your_public_key"
  }
}
```

**Implementation Notes:**
- Call PayMe API to generate payment
- Store payment details in your database
- Return payment URL if using hosted payment page, or payment_id if using API integration

---

### 2. Process Marketplace Payment (Split Transaction)
**Endpoint:** `POST /api/payme/marketplace/process`

**Request Body:**
```json
{
  "paymentId": "pay_123456789",
  "vendorId": "vendor789",
  "items": [
    {
      "name": "Recording Studio",
      "price": 50.00,
      "quantity": 2,
      "itemId": "item123",
      "studioId": "studio456"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment_id": "pay_123456789",
    "split_transaction_id": "split_987654321"
  }
}
```

**Implementation Notes:**
- Process split payment between platform and vendor
- Calculate platform fee (e.g., 10-15%)
- Use PayMe's split transaction API
- Update order status in database

---

### 3. Get Payment Status
**Endpoint:** `GET /api/payme/payment-status/:paymentId`

**Response:**
```json
{
  "payment_id": "pay_123456789",
  "status": "completed", // "pending" | "completed" | "failed" | "cancelled"
  "amount": 100.00,
  "currency": "ILS"
}
```

**Implementation Notes:**
- Query PayMe API for payment status
- Or check your database if you're storing status

---

### 4. Confirm Payment
**Endpoint:** `POST /api/payme/confirm-payment`

**Request Body:**
```json
{
  "paymentId": "pay_123456789",
  "orderId": "order_abc123" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment_id": "pay_123456789",
    "order_id": "order_abc123"
  }
}
```

**Implementation Notes:**
- Called after IPN/webhook confirms payment
- Update order status to confirmed
- Trigger confirmation emails
- Update reservation status

---

### 5. IPN/Webhook Handler
**Endpoint:** `POST /api/payme/ipn`

**Request Body:** (From PayMe webhook)
```json
{
  "payment_id": "pay_123456789",
  "status": "completed",
  "amount": 100.00,
  "currency": "ILS",
  "signature": "webhook_signature"
}
```

**Implementation Notes:**
- Validate webhook signature from PayMe
- Update payment status in database
- Trigger order confirmation
- Send confirmation emails
- Update reservations

---

## PayMe API Integration

### Authentication
You'll need to authenticate with PayMe using:
- Public Key: `VITE_PAYME_PUBLIC_KEY`
- Secret Key: `VITE_PAYME_SECRET_KEY`

### API Base URL
- Sandbox: Check PayMe documentation
- Production: Check PayMe documentation

### Key PayMe API Calls

1. **Generate Payment**
   - Use PayMe's payment generation API
   - Reference: [PayMe Docs - Generate Payment](https://docs.payme.io/docs/payments/d7da26bb42da8-generate-payment)

2. **Split Transactions**
   - Use PayMe's marketplace split transaction API
   - Calculate platform fee
   - Distribute funds to vendor

3. **Payment Status**
   - Query payment status from PayMe
   - Or use webhook/IPN for real-time updates

---

## Database Schema Considerations

You may want to store:
- Payment records with PayMe payment_id
- Order status
- Split payment details (platform fee, vendor amount)
- IPN/webhook logs

---

## Testing

1. Use PayMe's Smart Sandbox for testing
2. Test payment generation
3. Test split transactions
4. Test webhook/IPN handling
5. Test error scenarios

---

## Next Steps

1. Implement the 5 backend endpoints listed above
2. Integrate with PayMe API using their SDK or REST API
3. Set up webhook/IPN endpoint
4. Test in sandbox environment
5. Deploy to production

For detailed PayMe API documentation, visit: https://docs.payme.io/

