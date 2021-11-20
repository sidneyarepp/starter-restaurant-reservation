
exports.up = function (knex) {
    return knex('reservations')
        .string('reservation_status').defaultTo('booked');
};

exports.down = function (knex) {
    return knex.schema.alterTable('reservations', table => {
        table.dropColumn('reservation_status');
    });
};
