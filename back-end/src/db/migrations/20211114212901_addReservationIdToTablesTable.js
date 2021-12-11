exports.up = function (knex) {
  return knex.schema.table("tables", (table) => {
    table.integer("reservation_id");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("tables", (table) => {
    table.dropColumn("reservation_id");
  });
};
