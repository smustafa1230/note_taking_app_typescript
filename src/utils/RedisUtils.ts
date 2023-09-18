import { Service, Container } from "typedi";
import { Redis } from "ioredis";
import { RedisClient } from "@/config/RedisClient";

@Service()
export class RedisUtils {
  private client: Redis;
  constructor(private readonly redisClient: RedisClient) {
    this.client = this.redisClient.getClient();
  }

  async set(key: string, value: string, expiry = 2000): Promise<void> {
    await this.client.set(key, value, "EX", expiry);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
  async delete(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
