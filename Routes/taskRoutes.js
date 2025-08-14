import db from "../db.js";
import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.get("/", async (_req, res) => {
  console.log("GET /tasks hit!");
  try {
    const tasks = await db("tasks")
      .select(
        "id",
        "title",
        "description",
        "priority",
        "status",
        "deadline",
        "created_at"
      )
      .orderBy("created_at", "desc");

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("GET /tasks error:", error);
    return res.status(500).json({ message: "Error retrieving tasks" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tasks = await db("tasks")
      .select(
        "id",
        "title",
        "description",
        "priority",
        "status",
        "deadline",
        "created_at"
      )
      .where({ id })
      .first();

    if (!tasks) {
      return res
        .status(404)
        .json({ message: `task with ${id} can't be found` });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error retrieving tasks with ${id}` });
  }
});

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title Required"),
    body("description").optional().isString(),
    body("priority")
      .customSanitizer((v) => String(v).toLowerCase().trim())
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium or high"),
    body("status")
      .customSanitizer((v) => String(v).toLowerCase().trim())
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
      priority,
      status,
      deadline = "2025-08-10T00:00:00",
    } = req.body;

    try {
      /*  const [newTaskId] = await db("tasks").insert({
        title,
        description,
        priority,
        status,
        deadline,
      });

      const newTask = await db("tasks").where({ id: newTaskId }).first();
      return res.status(201).json(newTask); */
      const insertedRows = await db("tasks")
        .insert({
          title,
          description,
          priority,
          status,
          deadline,
        })
        .returning("id");

      const newTaskId = insertedRows[0].id;

      const newTask = await db("tasks")
        .select(
          "id",
          "title",
          "description",
          "priority",
          "status",
          "deadline",
          "created_at"
        )
        .where({ id: newTaskId })
        .first();

      return res.status(201).json(newTask);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to create task" });
    }
  }
);

router.patch("/:id", async (req, res) => {
  console.log("Incoming PATCH:", req.body);
  const { id } = req.params;
  const { status, priority, title, description, deadline } = req.body;

  try {
    const tasks = await db("tasks").where({ id }).first();
    if (!tasks) {
      return res.status(404).json({ message: `task with ${id} not found` });
    }

    await db("tasks")
      .where({ id })
      .update({ status, priority, title, description, deadline });

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("🔥 PATCH ERROR:", error);
    return res.status(500).json({ message: "Error updating task" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tasks = await db("tasks").where({ id }).first();
    if (!tasks) {
      return res.status(404).json({ message: `task with ${id} not found` });
    }

    await db("tasks").where({ id }).del();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting task" });
  }
});

export default router;
