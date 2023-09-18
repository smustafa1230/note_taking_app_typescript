import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import tokenVerificationMiddleware from "./middleware/auth/auth";
import router from "./router";
import userRoutes from "./router/userRoutes";
import swaggerUi from "swagger-ui-express";
import specs from "./config/Swagger";
// import * as c from "./Container";
const app: Application = express();

const PORT = 3000;

app.use(express.json());
app.use(helmet());

// Serve the Swagger UI at '/api-docs'
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ status: "Application Up and running.." });
});

app.use("/api/auth", router);
app.use("/api/user", tokenVerificationMiddleware, userRoutes);

app.use((err, req, res, next) => {
  // Handle the error here
  const statusCode = err.status || 500; // Default to 500 Internal Server Error
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: errorMessage });
});

app.listen(PORT, () => console.log(`app running on port ${PORT}`));
