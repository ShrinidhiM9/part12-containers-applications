const redis = require('redis');

// Create Redis client using the REDIS_URL from environment variables
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect(); // for redis v4+, connect returns a promise

// Promisify get and set for convenience
const getAsync = async (key) => {
  const value = await client.get(key);
  return value;
};

const setAsync = async (key, value) => {
  await client.set(key, value);
};

const incrAsync = async (key) => {
  await client.incr(key);
};

module.exports = { client, getAsync, setAsync, incrAsync };
