export const successResponses = {
  StandardSuccessResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Operation successful" },
      data: {
        type: "object",
        nullable: true
      }
    }
  }
};