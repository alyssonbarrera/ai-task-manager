import Redis from 'ioredis'

export const TTL = 60 * 60 * 24 // 1 day in seconds

export const cache = new Redis(process.env.REDIS_URL!)
