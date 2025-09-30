const express = require('express');
const app = express();
const todosRouter = require('./routes/todos');
const redis = require('./redis');

app.use(express.json());

// --- Temporary test route ---
app.post('/test', (req, res) => res.send('POST works'));

// Todo routes
app.use('/todos', todosRouter);

// Statistics route
app.get('/statistics', async (req, res) => {
  try {
    const addedTodos = await redis.getAsync('added_todos') || 0;
    res.json({ added_todos: Number(addedTodos) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => console.log('todo-backend listening on port 3000'));
