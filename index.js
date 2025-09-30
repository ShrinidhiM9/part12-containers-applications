// todo-app/todo-backend/index.js
const express = require('express');
const { createClient } = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;

const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

(async () => {
  await redisClient.connect();
  console.log(`Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);
})();

const app = express();
app.use(express.json());

// Simple visit counter endpoint
app.get('/', async (req, res) => {
  try {
    // Increment a key "visits" and return the new value
    const visits = await redisClient.incr('visits');
    res.json({
      message: 'Hello from todo-backend!',
      visits: Number(visits)
    });
  } catch (err) {
    console.error('Error incrementing visits:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Optional: endpoint to get the current count without incrementing
app.get('/visits', async (req, res) => {
  try {
    const v = await redisClient.get('visits');
    res.json({ visits: v ? Number(v) : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`todo-backend listening on port ${PORT}`);
});
