{
    _id: ObjectId,
    name: String,
    description: String,
    parentCategoryId: ObjectId, // null if top-level
    createdAt: Date
  }
  {
    "_id": "ObjectId",
    "name": "string",
    "parentCategory": "ObjectId", // Reference to another Category ID for nesting
    "createdAt": "Date",
    "updatedAt": "Date"
  }
  