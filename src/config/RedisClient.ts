import { Service } from "typedi";
import Redis from "ioredis";
import { REDIS_HOST, REDIS_PORT } from ".";

@Service()
export class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT, 10), // Ensure base 10
    });
  }

  getClient(): Redis {
    return this.client;
  }
}
