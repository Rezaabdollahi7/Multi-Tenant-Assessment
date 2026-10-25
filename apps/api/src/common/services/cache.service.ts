import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await this.cacheManager.get<T>(key);

      this.logger.debug(`GET ${key}: ${value == null ? 'MISS' : 'HIT'}`);

      return value ?? undefined;
    } catch (error) {
      this.logger.error(`GET failed for ${key}`, error);
      throw error;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttlSeconds * 1000);

      this.logger.debug(`SET succeeded: ${key}`);
    } catch (error) {
      this.logger.error(`SET failed for ${key}`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
