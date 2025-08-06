export const seed = async function (knex) {
  await knex("tasks").del(); // Clear existing data

  await knex("tasks").insert([
    {
      title: "Create dark mode toggle",
      description: "Implement dark/light theme switcher",
      priority: "high",
      status: "pending",
      deadline: "2025-08-08 17:00:00",
      created_at: knex.fn.now(),
    },
    {
      title: "Finish drag & drop",
      description: "Enable task reordering",
      priority: "medium",
      status: "in-progress",
      deadline: "2025-08-06 09:30:00",
      created_at: knex.fn.now(),
    },
    {
      title: "Deploy app",
      description: "Push frontend to Vercel, backend to Render",
      priority: "low",
      status: "completed",
      deadline: "2025-08-01 20:00:00",
      created_at: knex.fn.now(),
    },
  ]);
};
