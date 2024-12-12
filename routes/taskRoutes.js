const express = require("express");
const Task = require("../models/Task"); // Ensure Task model is defined
const router = express.Router();

// Middleware for validating Task ID
const validateTaskId = async (req, res, next) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "Invalid Task ID format." });
  }
  next();
};

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks." });
  }
});

// GET a specific task by ID
router.get("/:id", validateTaskId, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the task." });
  }
});

// POST create a new task
router.post("/", async (req, res) => {
  const { title, description, assignedTo, deadline } = req.body;

  // Basic input validation
  if (!title || !description || !deadline) {
    return res.status(400).json({ error: "Title, description, and deadline are required." });
  }

  try {
    const newTask = new Task({ title, description, assignedTo, deadline });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new task." });
  }
});

// PUT update a task by ID
router.put("/:id", validateTaskId, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate fields during the update
    });
    if (!updatedTask) return res.status(404).json({ error: "Task not found." });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the task." });
  }
});

// DELETE a task by ID
router.delete("/:id", validateTaskId, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the task." });
  }
});

module.exports = router;
