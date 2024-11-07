//done

Payment APIs : Manages payment integration for order processing.

1. POST /api/payments/create – Initiate a payment (integrate with payment gateway)
2. POST /api/payments/verify – Verify payment status after completion





Payment APIs : Handles integration with a payment gateway for secure and verified transactions.

Payment Processing
3. POST /api/payments/create – Initiate a payment, returning a payment URL or token for the payment gateway
4. POST /api/payments/verify – Verify the payment after completion, handling callback from the payment gateway



Payment Methods Management
5. GET /api/payments/methods – Retrieve available payment methods (e.g., credit card, PayPal)



Payment and Checkout APIs : Integrates with a payment gateway for secure transactions.
Payment Processing

6. POST /api/payments/initiate – Create a payment session
7. POST /api/payments/verify – Verify the transaction after payment completion
8. GET /api/payments/status/:paymentId – Check payment status for a given transaction



Checkout and Confirmation
9. POST /api/checkout – Finalize cart and confirm order details (checks stock, calculates total with discounts, and applies shipping)

10. POST /api/checkout/confirm – Confirm order placement after payment verification



Payment and Checkout APIs : Integrates with a payment gateway for secure transactions.
Payment Processing

11. POST /api/payments/initiate – Create a payment session
12. POST /api/payments/verify – Verify the transaction after payment completion
13. GET /api/payments/status/:paymentId – Check payment status for a given transaction


Checkout and Confirmation
14. POST /api/checkout – Finalize cart and confirm order details (checks stock, calculates total with discounts, and applies shipping)
15. POST /api/checkout/confirm – Confirm order placement after payment verification