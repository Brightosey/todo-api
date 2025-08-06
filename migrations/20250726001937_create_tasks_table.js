export function up(knex) {
  return knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();
    table.string("title");
    table.text("description");
    table.string("priority")
    table.string("status")
    table.dateTime('deadline').nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("tasks");
}
