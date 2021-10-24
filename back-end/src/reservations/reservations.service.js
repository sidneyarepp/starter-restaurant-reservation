const knex = require("../db/connection");

function list() {
    return knex('reservations')
        .select('*')
}

function listByDate(date) {
    return knex('reservations')
        .select('*')
        .where({ 'reservation_date': date })
        .orderBy('last_name', 'asc')
}


module.exports = {
    list,
    listByDate,
}