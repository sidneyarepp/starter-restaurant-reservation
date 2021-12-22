const knex = require("../db/connection");

//Lists all tables found in the database.
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

//Lists a single table based on the table id.
function read(id) {
  if (!id) {
    throw new Error("id is required for table service read.");
  }
  return knex("tables").select("*").where({ table_id: id });
}

//Returns a specific reservation from the reservations database.
function readReservation(id) {
  if (!id) {
    throw new Error("id is required for reservation service read.");
  }
  return knex("reservations").select("*").where({ reservation_id: id });
}

//Updates a reservation from the reservations database.
function updateReservationStatus(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((response) => response);
}

//Creates a new table in the tables database.
function create(table) {
  if (!table) {
    throw new Error("table required for table service create!");
  }
  return knex("tables")
    .insert(table, "*")
    .then((response) => response[0]);
}

//Changes a table's status to occupied when a reservation is seated at it, as well as changing the reservation_id to the reservation's id that was seated at it.
function setSeatReservation(tableId, reservationId) {
  if (!tableId) {
    throw new Error("tableId required for table service setSeatReservation!");
  }
  if (!reservationId) {
    throw new Error(
      "reservationId required for table service setSeatReservation!"
    );
  }
  return knex("tables").select("*").where({ table_id: tableId }).update({
    reservation_id: reservationId,
    table_availability: "occupied",
  });
}

//When a table is finished the reservation_id is set to null since no reservation is assigned to it, as well as setting the table's availability to free.
function clearTable(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).update({
    reservation_id: null,
    table_availability: "free",
  });
}

module.exports = {
  list,
  read,
  readReservation,
  updateReservationStatus,
  create,
  setSeatReservation,
  clearTable,
};
