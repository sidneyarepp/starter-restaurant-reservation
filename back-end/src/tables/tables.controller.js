const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validKeys = [
  "table_name",
  "capacity",
  "table_id",
  "created_at",
  "updated_at",
  "table_availability",
  "reservation_id",
];

const requiredKeys = ["table_name", "capacity"];

function hasData(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "data from the request body is missing.",
    });
  }
  next();
}

function hasTableName(req, res, next) {
  const table_name = req.body.data.table_name;
  if (!table_name || table_name === "" || table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name is required.",
    });
  }
  res.locals.table_name = table_name;
  next();
}

function hasCapacity(req, res, next) {
  const capacity = req.body.data.capacity;
  if (!capacity || capacity === "") {
    return next({
      status: 400,
      message: "capacity is required.",
    });
  }
  res.locals.capacity = capacity;
  next();
}

function capacityIsANumber(req, res, next) {
  const capacity = res.locals.capacity;

  if (isNaN(capacity) || typeof capacity === "string") {
    return next({
      status: 400,
      message: "capacity must be a number",
    });
  }
  return next();
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (!table.length) {
    return next({
      status: 404,
      message: `A table with the id ${req.params.table_id} does not exist.`,
    });
  }
  res.locals.table = table[0];
  res.locals.reservation_id = table[0].reservation_id;
  next();
}

async function reservationValidationCheck(req, res, next) {
  let reservation_id = null;
  if (req.body.data) {
    reservation_id = req.body.data.reservation_id;
  } else if (res.locals.table) {
    reservation_id = res.locals.table.reservation_id;
  }

  if (!reservation_id) {
    return next({
      status: 400,
      message: `reservation_id is missing.`,
    });
  }
  res.locals.reservation_id = reservation_id;
  next();
}

async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(res.locals.reservation_id);
  if (reservation.length) {
    res.locals.reservation = reservation[0];
    return next();
  } else {
    next({
      status: 404,
      message: `A reservation with a reservation_id of ${res.locals.reservation_id} does not exist.`,
    });
  }
}

function tableCheck(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  const status = table.table_availability;
  const tableCapacity = table.capacity;
  const partySize = reservation.people;

  if (status !== "free") {
    return next({
      status: 400,
      message:
        "This table is currently occupied. Please select a table that is available.",
    });
  }
  if (partySize > tableCapacity) {
    return next({
      status: 400,
      message: `Please select a table with a capacity that can handle ${partySize} people.`,
    });
  }
  next();
}

function reservationStatusCheck(req, res, next) {
  const reservationStatus = res.locals.reservation.status;

  if (reservationStatus === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated.",
    });
  }
  next();
}

function tableAvailabilityCheck(req, res, next) {
  const table = res.locals.table;
  const status = table.table_availability;
  if (status === "free") {
    return next({
      status: 400,
      message: "This table is not occupied.",
    });
  }
  next();
}

async function list(req, res) {
  res.status(200).json({ data: await service.list() });
}

async function create(req, res) {
  let table = { ...req.body.data, table_availability: "free" };

  if (table.reservation_id) {
    const reservation = await service.readReservation(table.reservation_id);
    const newTable = await service.create({
      table_name: table.table_name,
      capacity: table.capacity,
      table_availability: "free",
    });

    const updatedReservation = { ...reservation[0], status: "seated" };

    await service.updateReservationStatus(updatedReservation);

    await service.setSeatReservation(newTable.table_id, table.reservation_id);
    res.status(201).send({ data: newTable });
  } else {
    res.status(201).send({ data: await service.create(table) });
  }
}

async function seatReservation(req, res) {
  const table_id = res.locals.table.table_id;
  const reservation_id = res.locals.reservation.reservation_id;
  const updatedReservation = { ...res.locals.reservation, status: "seated" };
  await service.updateReservationStatus(updatedReservation);
  await service.setSeatReservation(table_id, reservation_id);
  res.status(200).json({ data: res.locals.table });
}

async function clearReservation(req, res) {
  const updatedReservation = { ...res.locals.reservation, status: "finished" };
  await service.updateReservationStatus(updatedReservation);
  await service.clearTable(req.params.table_id);
  res.sendStatus(200);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasCapacity,
    capacityIsANumber,
    hasTableName,
    asyncErrorBoundary(create),
  ],
  seatReservation: [
    hasData,
    reservationValidationCheck,
    reservationExists,
    reservationStatusCheck,
    tableExists,
    tableCheck,
    asyncErrorBoundary(seatReservation),
  ],
  clearReservation: [
    tableExists,
    tableAvailabilityCheck,
    reservationValidationCheck,
    reservationExists,
    asyncErrorBoundary(clearReservation),
  ],
};
