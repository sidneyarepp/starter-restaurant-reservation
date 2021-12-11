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

function reservationValidationCheck(req, res, next) {
  if (req.body.data) {
    const reservation_id = req.body.data.reservation_id;
    if (!reservation_id || reservation_id === "") {
      return next({
        status: 400,
        message: "reservation_id is required.",
      });
    }
    res.locals.reservation_id = reservation_id;
  }
  next();
}

async function reservationExists(req, res, next) {
  if (req.body.data) {
    const reservation_id = res.locals.reservation_id;
    const reservationInfo = await service.readReservation(reservation_id);
    if (!reservationInfo.length) {
      return next({
        status: 404,
        message: `A reservations with reservation_id ${reservation_id} was not found.`,
      });
    }
    res.locals.reservation = reservationInfo[0];
  }
  next();
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
  next();
}

function tableCheck(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  const status = table.table_availability;
  const tableCapacity = table.capacity;
  const partySize = reservation.people;

  if (status !== "Free") {
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

function deleteTableCheck(req, res, next) {
  const table = res.locals.table;
  const status = table.table_availability;
  if (status === "Free") {
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
  let table = req.body.data;
  let reservation = await service.readReservation(table.reservation_id);

  if (table.reservation_id) {
    const newTable = await service.create({
      table_name: table.table_name,
      capacity: table.capacity,
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
  const reservation_id = res.locals.reservation_id;
  const updatedReservation = { ...res.locals.reservation, status: "seated" };
  await service.updateReservationStatus(updatedReservation);
  await service.setSeatReservation(table_id, reservation_id);
  res.sendStatus(200);
}

async function clearReservation(req, res) {
  if (req.body.data) {
    const updatedReservation = {
      ...res.locals.reservation,
      status: "finished",
    };
    await service.updateReservationStatus(updatedReservation);
  }
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
    tableExists,
    tableCheck,
    reservationStatusCheck,
    asyncErrorBoundary(seatReservation),
  ],
  clearReservation: [
    tableExists,
    reservationValidationCheck,
    reservationExists,
    deleteTableCheck,
    asyncErrorBoundary(clearReservation),
  ],
};
