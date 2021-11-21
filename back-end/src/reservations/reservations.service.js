const knex = require("../db/connection");

function list() {
    return knex('reservations')
        .select('*')
}

function listByDate(date) {
    if (!date) {
        throw new Error("Date is required for reservation service date!")
    }
    return knex('reservations')
        .select('*')
        .where({ 'reservation_date': date })
        .orderBy('reservation_time', 'asc')
}

function create(reservation) {
    if (!reservation) {
        throw new Error("Reservation is require for reservation service create.")
    }
    return knex('reservations')
        .insert(reservation, '*');
}

function update(reservationId, statusChange) {
    return knex('reservations')
        .where({ 'reservation_id': reservationId })
        .update({ 'status': statusChange });
}

module.exports = {
    list,
    listByDate,
    create,
    update,
}