const knex = require("../db/connection");

function list() {
  return knex("reservations").select("*");
}

function read(id) {
  if (!id) {
    throw new Error("id is required for reservation service read");
  }
  return knex("reservations").select("*").where({ reservation_id: id });
}

function listByDate(date) {
  if (!date) {
    throw new Error("Date is required for reservation service date!");
  }
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time", "asc")
    .then((response) =>
      response.filter((response) => response.status !== "finished")
    );
}

function create(reservation) {
  if (!reservation) {
    throw new Error("Reservation is require for reservation service create.");
  }
  return knex("reservations")
    .insert(reservation, "*")
    .then((response) => response[0]);
}

function update(reservationId, changedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .update(changedReservation, "*")
    .then((response) => response[0]);
}

function updateReservationStatus(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((response) => response[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  read,
  listByDate,
  create,
  update,
  updateReservationStatus,
  search,
};
