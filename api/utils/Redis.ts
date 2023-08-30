import Redis from "ioredis";

const redis = new Redis({
  host: 'localhost',
  port: 6379
});

export const set = async (key: string, value: any)  => {
  try {
    // Set Value in Redis
    await redis.set(key, value);
    console.log(`Key ${key} has been set with value ${value}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export const get = async (key: string)  => {
  try {
    // Get Value from Redis
    const val = await redis.get(key);
    console.log(`Retrieved value for key ${key} from Redis: ${val}`);
    return val;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

