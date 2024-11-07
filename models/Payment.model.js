{
    "_id": "ObjectId",
    "orderId": "ObjectId", // Reference to Order ID
    "userId": "ObjectId", // Reference to User ID
    "amount": "decimal",
    "status": "string", // e.g., "Completed", "Pending", "Failed"
    "paymentMethod": "string", // e.g., "Credit Card", "PayPal"
    "transactionId": "string", // Payment gateway transaction ID
    "createdAt": "Date",
    "updatedAt": "Date"
  }
  