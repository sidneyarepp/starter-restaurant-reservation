const knex = require("../db/connection");

function list() {
    return knex('tables')
        .select('*')
        .orderBy('table_name');
}

function create(table) {
    if (!table) {
        throw new Error("table required for table service create!")
    }
    return knex('tables')
        .insert(table, '*');
}

function setSeatReservation(tableId, reservationId) {
    if (!tableId) {
        throw new Error("tableId required for table service setSeatReservation!")
    }
    if (!reservationId) {
        throw new Error("reservationId required for table service setSeatReservation!")
    }
    return knex('tables')
        .select('*')
        .where({ table_id: tableId })
        .update({
            assigned_reservation_id: reservationId,
            table_availability: 'occupied',
        })
}

function clearTable(tableId) {
    return knex('tables')
        .select('*')
        .where({ table_id: tableId })
        .update({
            assigned_reservation_id: null,
            table_availability: 'free',
        })
}

module.exports = {
    list,
    create,
    setSeatReservation,
    clearTable,
}