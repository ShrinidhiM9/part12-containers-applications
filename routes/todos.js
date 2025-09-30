const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Todo = require('../models/todo');
const redis = require('../redis'); // make sure this points to your Redis client

// helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* GET all todos */
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* POST create a new todo */
router.post('/', async (req, res) => {
  const { title, description, done, important, dueDate } = req.body;
  try {
    const newTodo = await Todo.create({ title, description, done, important, dueDate });

    // Increment Redis counter
    if (redis && redis.incrAsync) {
      await redis.incrAsync('added_todos');
    }

    res.status(201).json(newTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* GET a single todo by id */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid todo id' });

  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* PUT update a todo by id */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid todo id' });

  const allowedFields = ['title', 'description', 'done', 'important', 'dueDate'];
  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });
    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
