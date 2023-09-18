import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
    },
  },
  // API specifications
  apis: [path.join(__dirname, "../router/*.js")], // Replace with the path to your route files
  definitions: {
    UserSignupRequest: {
      type: "object",
      properties: {
        first_name: { type: "string" },
        last_name: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string", format: "password" },
      },
    },
    UserSignupResponse: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
const specs = swaggerJsdoc(options);

export default specs;
