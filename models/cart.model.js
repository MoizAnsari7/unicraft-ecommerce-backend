```json
{ "_id": "ObjectId", "userId": "ObjectId", "items": [{"productId": "ObjectId", "quantity": "number"}], "totalAmount": "decimal", "createdAt": "Date", "updatedAt": "Date" }
```


{
    _id: ObjectId,
    userId: ObjectId,
    items: [
      {
        productId: ObjectId,
        quantity: Number
      }
    ],
    createdAt: Date,
    updatedAt: Date
  }
  {
    "_id": "ObjectId",
    "userId": "ObjectId", // Reference to User ID
    "items": [
      {
        "productId": "ObjectId", // Reference to Product ID
        "quantity": "integer",
        "savedForLater": "boolean" // Flag for "saved for later"
      }
    ],
    "total": "decimal",
    "appliedCoupon": "ObjectId", // Reference to Coupon ID, if applied
    "createdAt": "Date",
    "updatedAt": "Date"
  }
  