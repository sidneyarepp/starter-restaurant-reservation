const knex = require("../db/connection");

//Returns all reservations in the database.
function list() {
  return knex("reservations").select("*");
}

//Returns a single reservation in the database based on an id.
function read(id) {
  if (!id) {
    throw new Error("id is required for reservation service read");
  }
  return knex("reservations").select("*").where({ reservation_id: id });
}

//Returns the reservations in the database for a specific date.
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

//Creates a new reservation in the database.
function create(reservation) {
  if (!reservation) {
    throw new Error("Reservation is require for reservation service create.");
  }
  return knex("reservations")
    .insert(reservation, "*")
    .then((response) => response[0]);
}

//Updates an existing reservation in the database based on the reservation_id.
function update(reservationId, changedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .update(changedReservation, "*")
    .then((response) => response[0]);
}

//Updates the status for an existing reservation.
function updateReservationStatus(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((response) => response[0]);
}

//Searches the database for all reservations that match a mobile number provided.
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
