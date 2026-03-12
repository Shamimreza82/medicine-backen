export const healthSchemas = {
  HealthResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Health check successful" },
      data: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          uptime: { type: "number", example: 123.45 },
          timestamp: { type: "string", format: "date-time" }
        }
      }
    }
  }
};