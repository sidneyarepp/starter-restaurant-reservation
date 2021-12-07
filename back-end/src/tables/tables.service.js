const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(id) {
  if (!id) {
    throw new Error("id is required for table service read.");
  }
  return knex("tables").select("*").where({ table_id: id });
}

function readReservation(id) {
  if (!id) {
    throw new Error("id is required for reservation service read.");
  }
  return knex("reservations").select("*").where({ reservation_id: id });
}

function updateReservationStatus(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((response) => response[0]);
}

function create(table) {
  if (!table) {
    throw new Error("table required for table service create!");
  }
  return knex("tables")
    .insert(table, "*")
    .then((response) => response[0]);
}

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
    assigned_reservation_id: reservationId,
    table_availability: "Occupied",
  });
}

function clearTable(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).update({
    assigned_reservation_id: null,
    table_availability: "Free",
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
