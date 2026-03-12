export const errorResponses = {
  ErrorResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "Something went wrong" },
      error: {
        type: "object",
        nullable: true
      }
    }
  },

  ValidationErrorResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "Invalid input data" },
      error: {
        type: "array",
        items: {
          type: "object",
          properties: {
            field: { type: "string", example: "body.name" },
            error: {
              type: "string",
              example: "Hospital name must be at least 2 characters"
            }
          }
        }
      }
    }
  }
};