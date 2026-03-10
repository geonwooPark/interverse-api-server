import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const url =
      this.configService.get<string>("REDIS_URL") ?? "redis://localhost:6379";

    this.client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        return Math.min(times * 100, 3000);
      },
      lazyConnect: true,
    });

    this.client.on("error", (err: Error) => console.error("[Redis]", err));
    this.client.on("connect", () => console.log("[Redis] connected"));

    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }

  getClient(): Redis {
    if (!this.client) {
      throw new Error(
        "Redis client not initialized. Is the app fully started?",
      );
    }
    return this.client;
  }
}
