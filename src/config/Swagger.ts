import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
    },
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  },
  // API specifications
  apis: [path.join(__dirname, "../router/*.js")], // Replace with the path to your route files
};
const specs = swaggerJsdoc(options);

export default specs;
