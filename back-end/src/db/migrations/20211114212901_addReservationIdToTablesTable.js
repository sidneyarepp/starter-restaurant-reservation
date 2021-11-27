
exports.up = function (knex) {
    return knex.schema.table('tables', table => {
        table.integer('assigned_reservation_id', 3);
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('tables', table => {
        table.dropColumn('assigned_reservation_id');
    });
};
