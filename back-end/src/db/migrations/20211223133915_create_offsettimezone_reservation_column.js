exports.up = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.integer("timezoneOffset");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.dropColumn("timezoneOffset");
  });
};
