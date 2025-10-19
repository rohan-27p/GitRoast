import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

//initialize the redis client from env
const redis = new Redis({
    url: process.env.UPSTASH_API_KEY,
    token: process.env.UPSTASH_REDIS_TOKEN
})


export const anonymousRoastLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(1, "1 m"),
  prefix: "gitroast_anonymous",
});