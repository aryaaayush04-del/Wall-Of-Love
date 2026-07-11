import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

// Support both Upstash standard env vars and Vercel KV env vars
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';

let redis: Redis | null = null;
if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
}

/**
 * Checks if the current user IP has exceeded the submission rate limit.
 * Limit: 3 submissions per 1 hour (3600 seconds).
 */
export async function checkSubmissionRateLimit(): Promise<{ allowed: boolean; error?: string }> {
  if (!redis) {
    console.warn("Redis is not configured. Skipping rate limit check.");
    return { allowed: true };
  }

  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    const key = `rate_limit_submit_${ip}`;

    const count = await redis.incr(key);
    
    if (count === 1) {
      // First submission, set expiration to 1 hour (3600 seconds)
      await redis.expire(key, 3600);
    }

    if (count > 3) {
      return { allowed: false, error: "Too many submissions. Please try again later." };
    }

    return { allowed: true };
  } catch (err) {
    console.error("Rate limiting error:", err);
    // Fail open if Redis is down so we don't break the app entirely
    return { allowed: true };
  }
}
