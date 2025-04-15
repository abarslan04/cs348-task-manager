import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// FILTER tasks by date or range
router.get('/filter', async (req, res) => {
  const { start, end } = req.query;

  const query = {};

  if (start && end) {
    query.dueDate = {
      $gte: new Date(start),
      $lte: new Date(end),
    };
  } else if (start) {
    query.dueDate = {
      $eq: new Date(start),
    };
  }

  try {
    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to filter tasks.' });
  }
});

// SORTED tasks by dueDate and time
router.get('/sorted', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1, time: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sorted tasks.' });
  }
});

// POST a new task
router.post('/', async (req, res) => {
  const { title, dueDate, time } = req.body;
  const task = new Task({ title, dueDate, time });
  await task.save();
  res.status(201).json(task);
});

// PUT (update) a task
router.put('/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
