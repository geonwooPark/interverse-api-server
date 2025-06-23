import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "INTERVERSE API SERVER V1",
      version: "1.0.0",
      description: "",
    },
    servers: [
      {
        url: process.env.DOMAIN,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/routers/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
