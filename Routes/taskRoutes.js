import db from "../db.js";
import express from "express";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const tasks = await db("tasks")
      .select("id", "title", "description", "priority", "status", "created_at")
      .orderBy("created_at", "desc");

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving tasks" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tasks = await db("tasks")
      .select("id", "title", "description", "priority", "status", "created_at")
      .where({ id })
      .first();

    if (!tasks) {
      return res
        .status(404)
        .json({ message: `task with ${id} can't be found` });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error retrieving tasks with ${id}` });
  }
});

router.post(
  "/",
  [
    check("title").notEmpty().withMessage("Title Required"),
    check("description").optional().isString(),
    check("priority")
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium or high"),
    check("status")
      .isIn(["pending", "in-progress", "completed"])
      .withMessage("Status must be pending, in-progress or completed"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description = "",
      priority = "medium",
      status = "pending",
    } = req.body;

    try {
      const [newTaskId] = await db("tasks").insert({
        title,
        description,
        priority,
        status,
      });

      const newTask = await db("tasks").where({ id: newTaskId }).first();
      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create task" });
    }
  }
);

export default router;
