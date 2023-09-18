import { DataSource } from "typeorm";
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from "./config";
console.log("host: ", DB_HOST);
console.log("host: ", DB_PORT);
console.log("DB_DATABASE", DB_DATABASE);
const AppDataSource = new DataSource({
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
  entities: [`${__dirname}/entities/**/*{.js,.ts}`],
});

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    console.log("mysql db connected:");
  })
  .catch((error) => console.log(error));

export default AppDataSource;
