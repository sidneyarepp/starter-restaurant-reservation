
exports.up = function (knex) {
    return knex.schema.table('tables', table => {
        table.string('table_availability', 8);
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('tables', table => {
        table.dropColumn('table_availability');
    });
};
