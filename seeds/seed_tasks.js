export const seed = async function (knex) {
  await knex("tasks").del(); // Clear existing data

  await knex("tasks").insert([
    {
      title: "Create dark mode toggle",
      description: "Implement dark/light theme switcher",
      priority: "high",
      status: "pending",
      created_at: new Date(),
    },
    {
      title: "Finish drag & drop",
      description: "Enable task reordering",
      priority: "medium",
      status: "in-progress",
      created_at: new Date(),
    },
    {
      title: "Deploy app",
      description: "Push frontend to Vercel, backend to Render",
      priority: "low",
      status: "completed",
      created_at: new Date(),
    },
  ]);
};

