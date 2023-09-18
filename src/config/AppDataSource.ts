import { Service } from "typedi";
import { DataSource } from "typeorm";
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from "@/config";

@Service()
export class AppDataSource {
  private connection: DataSource;

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      this.connection = new DataSource({
        type: "mysql",
        host: DB_HOST,
        port: Number(DB_PORT),
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        synchronize: true,
        logging: false,
        poolSize: 100,
        // dropSchema: true,
        entities: [`${__dirname}/../entities/**/*{.js,.ts}`],
        charset: "utf8mb4", // Specify the desired character set
      });

      await this.connection.initialize();
      console.log("MySQL database connected");
    } catch (error) {
      console.error("Error connecting to MySQL database:", error);
    }
  }

  getConnection(): DataSource {
    return this.connection;
  }
}

export default AppDataSource;
