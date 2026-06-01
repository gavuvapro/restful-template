module.exports = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Restful-template API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [{ url: process.env.APP_URL || "http://localhost:3000" }],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};
